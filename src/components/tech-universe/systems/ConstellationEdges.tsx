import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { edges, techById } from '../technologyData';
import { useUniverse } from '../UniverseContext';

const BASE_COLOR = '#4a4742';
const HIGHLIGHT_COLOR = '#34d399';

/** Flatten a list of edges into a Float32Array of segment endpoints using the
 *  globe layout (chords between the nodes' positions on the sphere surface). */
function buildPositions(edgeList: typeof edges, pos: Record<string, { x: number; y: number; z: number }>): Float32Array {
  const arr = new Float32Array(edgeList.length * 6);
  edgeList.forEach((e, i) => {
    const a = pos[e.from] ?? techById[e.from]?.position ?? { x: 0, y: 0, z: 0 };
    const b = pos[e.to] ?? techById[e.to]?.position ?? { x: 0, y: 0, z: 0 };
    arr[i * 6] = a.x;
    arr[i * 6 + 1] = a.y;
    arr[i * 6 + 2] = a.z;
    arr[i * 6 + 3] = b.x;
    arr[i * 6 + 4] = b.y;
    arr[i * 6 + 5] = b.z;
  });
  return arr;
}

/**
 * Constellation wiring: one faint lineSegments mesh for the whole graph plus
 * a second, brighter one for the edges touching the hovered/selected node.
 * Edges are chords through the globe, so far-side ones get depth-culled by the
 * shell - giving a real sense of a round planet.
 */
export const ConstellationEdges: React.FC<{ includeIds?: Set<string> }> = ({ includeIds }) => {
  const { selectedId, hoveredId, globePositions } = useUniverse();
  const focusId = hoveredId ?? selectedId;

  const visibleEdges = useMemo(
    () => (includeIds ? edges.filter((e) => includeIds.has(e.from) && includeIds.has(e.to)) : edges),
    [includeIds],
  );

  const baseGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buildPositions(visibleEdges, globePositions), 3));
    return geo;
  }, [visibleEdges, globePositions]);

  const highlightGeometry = useMemo(() => {
    if (!focusId) return null;
    const visible = visibleEdges.filter((e) => e.from === focusId || e.to === focusId);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buildPositions(visible, globePositions), 3));
    return geo;
  }, [focusId, visibleEdges, globePositions]);

  useEffect(() => {
    return () => {
      baseGeometry.dispose();
      highlightGeometry?.dispose();
    };
  }, [baseGeometry, highlightGeometry]);

  return (
    <group>
      <lineSegments geometry={baseGeometry}>
        <lineBasicMaterial color={BASE_COLOR} transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
      {highlightGeometry && highlightGeometry.attributes.position.count > 0 && (
        <lineSegments geometry={highlightGeometry}>
          <lineBasicMaterial color={HIGHLIGHT_COLOR} transparent opacity={0.5} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
};