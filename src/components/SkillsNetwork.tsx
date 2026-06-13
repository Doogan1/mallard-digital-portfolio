import { useMemo, useState, useRef, useEffect, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { loadProjects } from '../lib/parseProjects'
import {
  getSkillCategory,
  getNodeColors,
  SKILL_CATEGORIES,
  SKILL_CATEGORY_ORDER,
  type SkillCategory,
} from '../lib/skills'
import StackTag from './StackTag'
import styles from './SkillsNetwork.module.css'

const W = 960
const H = 620

/** Set to true to allow dragging individual nodes. */
const ENABLE_NODE_DRAG = false

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

type ZoomTransform = { x: number; y: number; k: number }

type DragState = {
  id: string
  startClientX: number
  startClientY: number
  startNodeX: number
  startNodeY: number
  hasMoved: boolean
}

export default function SkillsNetwork() {
  const navigate = useNavigate()
  const projects = loadProjects()
  const [hovered, setHovered] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState<ZoomTransform>({ x: 0, y: 0, k: 1 })
  const zoomRef = useRef<ZoomTransform>({ x: 0, y: 0, k: 1 })
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  // Run simulation once, derive positions
  const { simNodes, resolvedLinks } = useMemo(() => {
    const { nodes, links } = buildGraph(projects)

    d3.forceSimulation<GraphNode>(nodes)
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
      .tick(300)

    const resolvedLinks = links.map((l) => ({
      source: (l.source as GraphNode).id,
      target: (l.target as GraphNode).id,
      weight: (l as GraphLink).weight,
    }))

    return { simNodes: nodes, resolvedLinks }
  }, [projects])

  // Node positions live in state so drag updates trigger re-render
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(() => {
    const m = new Map<string, { x: number; y: number }>()
    simNodes.forEach((n) => m.set(n.id, { x: n.x ?? W / 2, y: n.y ?? H / 2 }))
    return m
  })

  // D3 zoom — attached once, excludes node-initiated pointer events via nativeEvent
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)

    const behavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on('start', () => setIsPanning(true))
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { x, y, k } = event.transform
        zoomRef.current = { x, y, k }
        setZoom({ x, y, k })
      })
      .on('end', () => setIsPanning(false))

    zoomBehavior.current = behavior
    svg.call(behavior)
    svg.on('dblclick.zoom', null) // reclaim dblclick for reset

    return () => { svg.on('.zoom', null) }
  }, [])

  function resetZoom() {
    if (!svgRef.current || !zoomBehavior.current) return
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomBehavior.current.transform, d3.zoomIdentity)
  }

  function zoomBy(factor: number) {
    if (!svgRef.current || !zoomBehavior.current) return
    d3.select(svgRef.current)
      .transition()
      .duration(200)
      .call(zoomBehavior.current.scaleBy, factor)
  }

  // Node drag — stop native event so D3 zoom doesn't also fire
  function onNodePointerDown(id: string, e: React.PointerEvent<SVGGElement>) {
    e.nativeEvent.stopPropagation()
    if (!ENABLE_NODE_DRAG) return
    const pos = positions.get(id)
    if (!pos) return
    dragRef.current = {
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startNodeX: pos.x,
      startNodeY: pos.y,
      hasMoved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onNodePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!ENABLE_NODE_DRAG || !dragRef.current) return
    const { id, startClientX, startClientY, startNodeX, startNodeY } = dragRef.current
    const dx = (e.clientX - startClientX) / zoomRef.current.k
    const dy = (e.clientY - startClientY) / zoomRef.current.k
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragRef.current.hasMoved = true
    setPositions((prev) => {
      const next = new Map(prev)
      next.set(id, { x: startNodeX + dx, y: startNodeY + dy })
      return next
    })
  }

  function onNodePointerUp() {
    if (!ENABLE_NODE_DRAG) return
    dragRef.current = null
  }

  function onNodeClick(id: string) {
    if (dragRef.current?.hasMoved) return
    navigate(`/projects?tag=${encodeURIComponent(id)}`)
  }

  // Connected-node set for hover highlighting
  const connectedTo = useMemo(() => {
    if (!hovered) return new Set<string>()
    const s = new Set<string>()
    resolvedLinks.forEach(({ source, target }) => {
      if (source === hovered) s.add(target)
      if (target === hovered) s.add(source)
    })
    return s
  }, [hovered, resolvedLinks])

  const hoveredNode = hovered ? simNodes.find((n) => n.id === hovered) : null
  const hoveredProjects = hovered ? projects.filter((p) => p.stack.includes(hovered)) : []

  return (
    <div className={styles.wrapper}>
      {/* Zoom controls */}
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={() => zoomBy(1.4)} title="Zoom in" aria-label="Zoom in">+</button>
        <button className={styles.controlBtn} onClick={() => zoomBy(1 / 1.4)} title="Zoom out" aria-label="Zoom out">−</button>
        <button className={styles.controlBtn} onClick={resetZoom} title="Reset view" aria-label="Reset view">⊡</button>
        <span className={styles.zoomLevel}>{Math.round(zoom.k * 100)}%</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onDoubleClick={resetZoom}
      >
        <g transform={`translate(${zoom.x},${zoom.y}) scale(${zoom.k})`}>
          {/* Edges */}
          <g pointerEvents="none">
            {resolvedLinks.map(({ source, target, weight }) => {
              const s = positions.get(source)
              const t = positions.get(target)
              if (!s || !t) return null
              const isLit = hovered !== null && (source === hovered || target === hovered)
              const isDim = hovered !== null && !isLit
              return (
                <line
                  key={`${source}--${target}`}
                  x1={s.x} y1={s.y}
                  x2={t.x} y2={t.y}
                  stroke={isLit ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth={weight * 1.5}
                  strokeOpacity={isDim ? 0.08 : isLit ? 0.75 : 0.45}
                  style={{ transition: 'stroke-opacity 0.12s, stroke 0.12s' }}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {simNodes.map((node) => {
              const pos = positions.get(node.id)
              if (!pos) return null
              const r = nodeRadius(node.count)
              const category = getSkillCategory(node.id)
              const categoryMismatch = activeCategory !== 'all' && category !== activeCategory
              const isHovered = hovered === node.id
              const isConnected = connectedTo.has(node.id)
              const isDim =
                categoryMismatch ||
                (hovered !== null && !isHovered && !isConnected)

              const nodeState = isHovered
                ? 'hover'
                : isConnected
                ? 'connected'
                : isDim
                ? 'dim'
                : 'default'
              const colors = getNodeColors(category, nodeState)

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{
                    opacity: categoryMismatch ? 0.12 : isDim ? 0.18 : 1,
                    cursor: 'pointer',
                    transition: 'opacity 0.12s',
                  }}
                  onMouseEnter={() => !dragRef.current && setHovered(node.id)}
                  onMouseLeave={() => !dragRef.current && setHovered(null)}
                  onClick={() => onNodeClick(node.id)}
                  onPointerDown={(e) => onNodePointerDown(node.id, e)}
                  onPointerMove={onNodePointerMove}
                  onPointerUp={onNodePointerUp}
                >
                  <title>{node.id} · {node.count} project{node.count !== 1 ? 's' : ''}</title>

                  <circle
                    r={r}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isHovered ? 2 : 1.5}
                    style={{ transition: 'fill 0.12s, stroke 0.12s' }}
                  />

                  {/* Node label — centered */}
                  <text
                    dy="0.35em"
                    textAnchor="middle"
                    fontSize={Math.max(8, Math.min(11, r * 0.85))}
                    fill={colors.text}
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={isHovered ? 600 : 400}
                    style={{ pointerEvents: 'none', userSelect: 'none', transition: 'fill 0.12s' }}
                  >
                    {node.id}
                  </text>

                  {/* Floating label above on hover */}
                  {isHovered && (
                    <text
                      y={-(r + 9)}
                      textAnchor="middle"
                      fontSize={12}
                      fill="#e8eaf0"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight={600}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {node.id}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </g>
      </svg>

      {/* Category legend + filter */}
      <div className={styles.legend}>
        <button
          type="button"
          className={`${styles.legendItem} ${activeCategory === 'all' ? styles.legendItemActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {SKILL_CATEGORY_ORDER.filter((c) => c !== 'other').map((category) => {
          const { label, color } = SKILL_CATEGORIES[category]
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              className={`${styles.legendItem} ${isActive ? styles.legendItemActive : ''}`}
              style={{ '--legend-color': color } as CSSProperties}
              onClick={() => setActiveCategory(isActive ? 'all' : category)}
            >
              <span className={styles.legendDot} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Info panel */}
      <div className={styles.info}>
        {hoveredNode ? (
          <>
            <StackTag tag={hoveredNode.id} />
            <span className={styles.infoMeta}>
              {hoveredNode.count} project{hoveredNode.count !== 1 ? 's' : ''} —{' '}
              {hoveredProjects.map((p) => p.title).join(', ')}
            </span>
            <span className={styles.infoHint}>click to filter →</span>
          </>
        ) : (
          <span className={styles.infoHint}>
            hover · click to filter · scroll to zoom · double-click to reset
          </span>
        )}
      </div>
    </div>
  )
}
