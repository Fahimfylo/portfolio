import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Box {
  width: number;
  height: number;
}

interface ImageCropModalProps {
  src: string;
  fileName: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

type DragState =
  | { mode: 'move'; startX: number; startY: number; start: Rect }
  | { mode: 'draw'; startX: number; startY: number }
  | { mode: 'resize'; handle: string; startRect: Rect };

const MIN = 24;
const PAD = 24;

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;

const HANDLE_POS: Record<string, React.CSSProperties> = {
  nw: { left: 0, top: 0, cursor: 'nwse-resize' },
  n: { left: '50%', top: 0, cursor: 'ns-resize' },
  ne: { left: '100%', top: 0, cursor: 'nesw-resize' },
  e: { left: '100%', top: '50%', cursor: 'ew-resize' },
  se: { left: '100%', top: '100%', cursor: 'nwse-resize' },
  s: { left: '50%', top: '100%', cursor: 'ns-resize' },
  sw: { left: 0, top: '100%', cursor: 'nesw-resize' },
  w: { left: 0, top: '50%', cursor: 'ew-resize' },
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const clampRect = (r: Rect, b: Box): Rect => {
  const w = clamp(r.w, MIN, b.width);
  const h = clamp(r.h, MIN, b.height);
  const x = clamp(r.x, 0, b.width - w);
  const y = clamp(r.y, 0, b.height - h);
  return { x, y, w, h };
};

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ src, fileName, onCancel, onConfirm }) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const naturalRef = useRef({ w: 0, h: 0 });
  const dragRef = useRef<DragState | null>(null);

  const [box, setBox] = useState<Box | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [dragging, setDragging] = useState(false);
  const [working, setWorking] = useState(false);

  const computeBox = useCallback(() => {
    const area = areaRef.current;
    const nat = naturalRef.current;
    if (!area || !nat.w || !nat.h) return;
    const availW = area.clientWidth - PAD * 2;
    const availH = area.clientHeight - PAD * 2;
    if (availW <= 0 || availH <= 0) return;
    const scale = Math.min(availW / nat.w, availH / nat.h, 1);
    setBox({ width: Math.round(nat.w * scale), height: Math.round(nat.h * scale) });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight };
      computeBox();
    };
    img.src = src;
  }, [src, computeBox]);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const ro = new ResizeObserver(() => computeBox());
    ro.observe(area);
    window.addEventListener('resize', computeBox);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeBox);
    };
  }, [computeBox]);

  useEffect(() => {
    if (!box) return;
    setRect((prev) =>
      prev ?? { x: box.width * 0.1, y: box.height * 0.1, w: box.width * 0.8, h: box.height * 0.8 }
    );
    setRect((prev) => (prev ? clampRect(prev, box) : prev));
  }, [box]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const getPos = (e: { clientX: number; clientY: number }) => {
    const el = wrapperRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const beginMove = (e: React.PointerEvent) => {
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { mode: 'move', startX: e.clientX, startY: e.clientY, start: { ...rect } };
    setDragging(true);
  };

  const beginResize = (e: React.PointerEvent, handle: string) => {
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { mode: 'resize', handle, startRect: { ...rect } };
    setDragging(true);
  };

  const beginDraw = (e: React.PointerEvent) => {
    if (!box) return;
    const { x, y } = getPos(e);
    dragRef.current = { mode: 'draw', startX: x, startY: y };
    setRect({ x, y, w: MIN, h: MIN });
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging || !box) return;
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const p = getPos(e);
      if (d.mode === 'draw') {
        const x1 = clamp(Math.min(d.startX, p.x), 0, box.width);
        const x2 = clamp(Math.max(d.startX, p.x), 0, box.width);
        const y1 = clamp(Math.min(d.startY, p.y), 0, box.height);
        const y2 = clamp(Math.max(d.startY, p.y), 0, box.height);
        setRect(
          clampRect(
            { x: x1, y: y1, w: Math.max(x2 - x1, MIN), h: Math.max(y2 - y1, MIN) },
            box
          )
        );
      } else if (d.mode === 'move') {
        setRect({
          x: clamp(d.start.x + (e.clientX - d.startX), 0, box.width - d.start.w),
          y: clamp(d.start.y + (e.clientY - d.startY), 0, box.height - d.start.h),
          w: d.start.w,
          h: d.start.h,
        });
      } else {
        const s = d.startRect;
        let L = s.x;
        let T = s.y;
        let R = s.x + s.w;
        let B = s.y + s.h;
        if (d.handle.includes('n')) T = clamp(p.y, 0, B - MIN);
        if (d.handle.includes('s')) B = clamp(p.y, T + MIN, box.height);
        if (d.handle.includes('w')) L = clamp(p.x, 0, R - MIN);
        if (d.handle.includes('e')) R = clamp(p.x, L + MIN, box.width);
        setRect({ x: L, y: T, w: R - L, h: B - T });
      }
    };
    const up = () => {
      dragRef.current = null;
      setDragging(false);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging, box]);

  const confirm = () => {
    const img = imageRef.current;
    const nat = naturalRef.current;
    if (!img || !box || !rect || !nat.w || working) return;
    setWorking(true);
    const scale = nat.w / box.width;
    const sx = Math.round(rect.x * scale);
    const sy = Math.round(rect.y * scale);
    const sw = Math.max(1, Math.round(rect.w * scale));
    const sh = Math.max(1, Math.round(rect.h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setWorking(false);
      return;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob((blob) => {
      if (!blob) {
        setWorking(false);
        return;
      }
      const outName = fileName.replace(/\.[^.]+$/, '') + (blob.type === 'image/jpeg' ? '.jpg' : '.png');
      onConfirm(new File([blob], outName, { type: blob.type }));
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-display font-bold text-white">Crop Image</h3>
            <p className="text-[10px] font-mono text-[#777] mt-0.5">
              Drag anywhere to draw an area · drag inside to move · use the handles to resize freely
            </p>
          </div>
          <button onClick={onCancel} className="p-2 text-[#666] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={areaRef} className="relative w-full h-[58vh] flex items-center justify-center overflow-hidden">
          {box && (
            <div
              ref={wrapperRef}
              onPointerDown={beginDraw}
              style={{ width: box.width, height: box.height, cursor: 'crosshair' }}
              className="relative select-none"
            >
              <img
                ref={imageRef}
                src={src}
                alt="To crop"
                draggable={false}
                className="w-full h-full pointer-events-none select-none"
              />
              {rect && (
                <div
                  onPointerDown={beginMove}
                  className="absolute cursor-move border border-emerald-400"
                  style={{
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/15" />
                    ))}
                  </div>
                  {HANDLES.map((h) => (
                    <div
                      key={h}
                      onPointerDown={(e) => beginResize(e, h)}
                      style={{ ...HANDLE_POS[h], transform: 'translate(-50%, -50%)' }}
                      className="absolute w-3 h-3 bg-emerald-400 border border-black/50 rounded-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
          <span className="text-[10px] font-mono text-[#555]">Free crop · no fixed ratio</span>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#aaa] hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={!rect || working}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs uppercase font-bold hover:bg-neutral-200 transition-colors disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              {working ? 'Cropping...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
