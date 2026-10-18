import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, ZoomIn, ZoomOut, Maximize2, CheckSquare, Square, Info } from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";
import { toast } from "react-toastify";

const MindMapViewer = ({ courseId, moduleId, lectureId }) => {
  const [mapId, setMapId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [zoom, setZoom] = useState(1);

  const fetchMap = async () => {
    if (!lectureId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/mindmaps/lecture/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setMapId(res.data._id);
        setNodes(res.data.nodes || []);
        if (res.data.nodes?.length > 0) {
          setSelectedNode(res.data.nodes[0]);
        }
      } else {
        setNodes([]);
        setMapId(null);
      }
    } catch (err) {
      console.error("Failed to fetch mind map:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMap();
    setCollapsedNodes({});
    setZoom(1);
  }, [lectureId]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/mindmaps/generate",
        { courseId, moduleId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMapId(res.data._id);
      setNodes(res.data.nodes || []);
      if (res.data.nodes?.length > 0) {
        setSelectedNode(res.data.nodes[0]);
      }
      toast.success("AI successfully created your interactive Mind Map!");
    } catch (err) {
      toast.error("Failed to generate AI mind map.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleComplete = async (nodeId, e) => {
    if (e) e.stopPropagation();
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/mindmaps/${mapId}/node/${nodeId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedNodes = res.data.map.nodes || [];
      setNodes(updatedNodes);
      
      if (selectedNode?.id === nodeId) {
        setSelectedNode(updatedNodes.find((n) => n.id === nodeId));
      }
      
      toast.success("Topic completion updated.");
    } catch (err) {
      toast.error("Failed to toggle completion.");
    }
  };

  const toggleCollapse = (nodeId, e) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Helper to build node coordinates (simple tree coordinates calculation)
  const getLayoutedNodes = () => {
    const root = nodes.find((n) => !n.parentId);
    if (!root) return [];

    const computed = [];
    const childrenMap = {};
    nodes.forEach((n) => {
      if (n.parentId) {
        if (!childrenMap[n.parentId]) childrenMap[n.parentId] = [];
        childrenMap[n.parentId].push(n);
      }
    });

    const isNodeVisible = (node) => {
      let current = node;
      while (current.parentId) {
        if (collapsedNodes[current.parentId]) return false;
        current = nodes.find((n) => n.id === current.parentId);
        if (!current) return false;
      }
      return true;
    };

    const traverse = (node, depth, xOffset) => {
      const visible = isNodeVisible(node);
      
      computed.push({
        ...node,
        x: xOffset,
        y: depth * 110 + 60,
        visible
      });

      const children = childrenMap[node.id] || [];
      if (children.length > 0 && !collapsedNodes[node.id]) {
        const spacing = 180 / Math.max(1, children.length - 1);
        children.forEach((child, idx) => {
          const childX = children.length === 1 
            ? xOffset 
            : xOffset - 90 + idx * spacing;
          traverse(child, depth + 1, childX);
        });
      }
    };

    traverse(root, 0, 300); // start at coordinates (300, 60)
    return computed;
  };

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl gap-4">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mapping educational connections...</p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl gap-4">
        <Sparkles size={32} className="text-purple-400" />
        <div>
          <h4 className="text-sm font-black text-white">Generate AI Mind Map</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Analyze this lecture structure to build an interactive nodes network of concept relationships.
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          className="py-2.5 px-6 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-550 text-white uppercase tracking-wider"
        >
          Generate Mind Map
        </Button>
      </div>
    );
  }

  const layouted = getLayoutedNodes();

  return (
    <div className="grid md:grid-cols-12 gap-6 items-start">
      {/* Left Side: Map Interactive Area (col-span-8) */}
      <div className="md:col-span-8 space-y-4">
        <GlassCard className="p-4 border-white/5 rounded-3xl relative overflow-hidden bg-slate-950 flex flex-col justify-between select-none">
          {/* Map Toolbar */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5 relative z-10 shrink-0">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Interactive Tree Graph</span>
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut size={12} />
              </button>
              <span className="text-[9px] font-bold text-gray-500 w-8 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* SVG Mind Map viewport */}
          <div className="w-full overflow-auto h-[320px] relative mt-3 border border-white/5 rounded-2xl bg-black/25">
            <div 
              className="origin-top-left transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, width: "600px", height: "400px", position: "relative" }}
            >
              {/* Connectors (SVG Links) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {layouted.map((node) => {
                  if (!node.parentId || !node.visible) return null;
                  const parentNode = layouted.find((n) => n.id === node.parentId);
                  if (!parentNode || !parentNode.visible) return null;
                  return (
                    <line
                      key={node.id}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="rgba(147, 51, 234, 0.25)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>

              {/* Node Widgets */}
              {layouted.map((node) => {
                if (!node.visible) return null;
                const isSelected = selectedNode?.id === node.id;
                const children = nodes.filter((n) => n.parentId === node.id);
                const hasChildren = children.length > 0;
                const isCollapsed = collapsedNodes[node.id];

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x - 70}px`, top: `${node.y - 22}px` }}
                    className={`absolute w-[140px] p-2.5 rounded-xl border cursor-pointer text-center select-none transition-all flex flex-col justify-between items-center shadow-lg hover:scale-105 ${
                      isSelected
                        ? "border-purple-500 bg-purple-950/20 text-white"
                        : node.isCompleted
                          ? "border-emerald-500/30 bg-emerald-950/5 text-emerald-400"
                          : "border-white/5 bg-slate-950 text-gray-300"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-1">
                      <span className="text-[9px] font-black truncate flex-1 text-left">{node.label}</span>
                      
                      {/* Collapse/Expand Toggle indicator */}
                      {hasChildren && (
                        <button
                          onClick={(e) => toggleCollapse(node.id, e)}
                          className="w-3.5 h-3.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold font-mono flex items-center justify-center shrink-0 hover:bg-white/10"
                        >
                          {isCollapsed ? "+" : "-"}
                        </button>
                      )}
                    </div>

                    <div className="w-full flex justify-between items-center mt-2.5 pt-1.5 border-t border-white/5 text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={(e) => handleToggleComplete(node.id, e)}
                        className="hover:text-white"
                      >
                        {node.isCompleted ? "✓ Done" : "Todo"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Side: Node details panel (col-span-4) */}
      <div className="md:col-span-4">
        {selectedNode ? (
          <GlassCard className="p-6 border-purple-500/20 bg-purple-950/5 space-y-4 rounded-3xl">
            <div>
              <span className="text-[9px] text-purple-400 font-extrabold uppercase tracking-widest block">Selected Concept</span>
              <h4 className="text-sm font-black text-white mt-1">{selectedNode.label}</h4>
            </div>

            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              {selectedNode.description || "No concept description provided."}
            </p>

            <div className="pt-4 border-t border-white/5 flex flex-col gap-2.5 text-xs">
              <button
                onClick={(e) => handleToggleComplete(selectedNode.id, e)}
                className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-[9px] border flex items-center justify-center gap-1.5 transition-all ${
                  selectedNode.isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {selectedNode.isCompleted ? (
                  <>
                    <CheckSquare size={12} /> Concept Mastered
                  </>
                ) : (
                  <>
                    <Square size={12} /> Mark as Mastered
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="p-6 text-center border border-white/5 bg-white/[0.01] rounded-3xl text-xs text-gray-500 font-bold uppercase tracking-wider">
            Select a concept node to view breakdown details.
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMapViewer;
