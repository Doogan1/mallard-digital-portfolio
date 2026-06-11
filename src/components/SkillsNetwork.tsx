import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { loadProjects } from '../lib/parseProjects'
import styles from './SkillsNetwork.module.css'

const W = 960
const H = 620

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  count: number
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  weight: number
}

function buildGraph(projects: ReturnType<typeof loadProjects>) {
  const nodeFreq = new Map<string, number>()
  const edgeFreq = new Map<string, number>()

  projects.forEach((p) => {
    p.stack.forEach((t) => nodeFreq.set(t, (nodeFreq.get(t) ?? 0) + 1))
    for (let i = 0; i < p.stack.length; i++) {
      for (let j = i + 1; j < p.stack.length; j++) {
        const key = [p.stack[i], p.stack[j]].sort().join('\0')
        edgeFreq.set(key, (edgeFreq.get(key) ?? 0) + 1)
      }
    }
  })

  const nodes: GraphNode[] = Array.from(nodeFreq.entries()).map(([id, count]) => ({
    id,
    count,
  }))

  const links: GraphLink[] = Array.from(edgeFreq.entries()).map(([key, weight]) => {
    const [source, target] = key.split('\0')
    return { source, target, weight }
  })

  return { nodes, links }
}

function nodeRadius(count: number) {
  return 6 + count * 3.5
}

export default function SkillsNetwork() {
  const navigate = useNavigate()
  const projects = loadProjects()
  const [hovered, setHovered] = useState<string | null>(null)

  const { nodes, links } = useMemo(() => {
    const { nodes, links } = buildGraph(projects)

    const sim = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((l) => 90 + (3 - Math.min((l as GraphLink).weight, 3)) * 15),
      )
      .force('charge', d3.forceManyBody<GraphNode>().strength(-220))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force(
        'collision',
        d3.forceCollide<GraphNode>().radius((d) => nodeRadius(d.count) + 12),
      )
      .stop()

    sim.tick(300)

    return { nodes, links }
  }, [projects])

  const nodeMap = useMemo(() => {
    const m = new Map<string, GraphNode>()
    nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [nodes])

  // After sim runs, link.source/target are node objects
  const resolvedLinks = links.map((l) => ({
    source: l.source as GraphNode,
    target: l.target as GraphNode,
    weight: l.weight,
  }))

  const connectedTo = useMemo(() => {
    if (!hovered) return new Set<string>()
    const s = new Set<string>()
    resolvedLinks.forEach(({ source, target }) => {
      if (source.id === hovered) s.add(target.id)
      if (target.id === hovered) s.add(source.id)
    })
    return s
  }, [hovered, resolvedLinks])

  const hoveredNode = hovered ? nodeMap.get(hovered) : null
  const hoveredProjects = hovered
    ? projects.filter((p) => p.stack.includes(hovered))
    : []

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        aria-label="Skills co-occurrence network"
      >
        {/* Edges */}
        <g>
          {resolvedLinks.map(({ source: s, target: t, weight }) => {
            const isLit =
              hovered !== null && (s.id === hovered || t.id === hovered)
            const isDim =
              hovered !== null && s.id !== hovered && t.id !== hovered
            return (
              <line
                key={`${s.id}--${t.id}`}
                x1={s.x} y1={s.y}
                x2={t.x} y2={t.y}
                stroke={isLit ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={weight * 1.5}
                strokeOpacity={isDim ? 0.15 : isLit ? 0.75 : 0.45}
                style={{ transition: 'stroke-opacity 0.15s, stroke 0.15s' }}
              />
            )
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const r = nodeRadius(node.count)
            const isHovered = hovered === node.id
            const isConnected = connectedTo.has(node.id)
            const isDim = hovered !== null && !isHovered && !isConnected

            return (
              <g
                key={node.id}
                transform={`translate(${node.x ?? W / 2},${node.y ?? H / 2})`}
                className={styles.node}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() =>
                  navigate(`/projects?tag=${encodeURIComponent(node.id)}`)
                }
                style={{ opacity: isDim ? 0.25 : 1, transition: 'opacity 0.15s' }}
              >
                <circle
                  r={r}
                  fill={
                    isHovered
                      ? 'rgba(124,106,247,0.45)'
                      : isConnected
                      ? 'rgba(124,106,247,0.25)'
                      : 'rgba(124,106,247,0.12)'
                  }
                  stroke={
                    isHovered
                      ? '#a99fff'
                      : isConnected
                      ? 'rgba(124,106,247,0.6)'
                      : 'rgba(124,106,247,0.35)'
                  }
                  strokeWidth={isHovered ? 2 : 1.5}
                  style={{ transition: 'fill 0.15s, stroke 0.15s' }}
                />
                <text
                  dy="0.35em"
                  textAnchor="middle"
                  fontSize={Math.max(8, Math.min(11, r * 0.85))}
                  fill={isHovered ? '#e8eaf0' : isConnected ? '#c0c3d0' : '#7a7f94'}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isHovered ? 600 : 400}
                  style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
                >
                  {node.id}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Info panel */}
      <div className={styles.info}>
        {hoveredNode ? (
          <>
            <span className={styles.infoTag}>{hoveredNode.id}</span>
            <span className={styles.infoMeta}>
              {hoveredNode.count} project{hoveredNode.count !== 1 ? 's' : ''}
              {' · '}
              {hoveredProjects.map((p) => p.title).join(', ')}
            </span>
            <span className={styles.infoHint}>Click to filter projects →</span>
          </>
        ) : (
          <span className={styles.infoHint}>
            Hover a node to see which projects use it · Click to filter
          </span>
        )}
      </div>
    </div>
  )
}
