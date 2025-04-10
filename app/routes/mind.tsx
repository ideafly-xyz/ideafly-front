import React, { useCallback, useState, useEffect,useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  NodeProps,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


interface DocumentData {
  title: string;
  content: string;
}

interface NodeData {
  label: string;
  children?: string[];
  count?: number;
  collapsed?: boolean;
  document?: DocumentData;
}

const MindMapNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const [label, setLabel] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean } | null>(null);
  const [docModal, setDocModal] = useState<{ title: string; content: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 初始化时设置高度并通知外部
  useEffect(() => {
    if (textareaRef.current) {
      // 重置高度为 0，确保 scrollHeight 基于实际内容
      textareaRef.current.style.height = '0';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      window.dispatchEvent(
        new CustomEvent('updateNodeSize', {
          detail: { nodeId: id, height: scrollHeight },
        })
      );
    }
  }, [id]);

  const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLabel(evt.target.value);
    const target = evt.target;
    target.style.height = '0'; // 重置为 0 以获取准确的 scrollHeight
    target.style.height = `${target.scrollHeight}px`;
    window.dispatchEvent(
      new CustomEvent('updateNodeSize', {
        detail: { nodeId: id, height: target.scrollHeight },
      })
    );
  };

  const isRoot = id === 'root';
  const hasChildren = data.children && data.children.length > 0;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ visible: true });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteNode = () => {
    if (isRoot) {
      alert('根节点不能被删除！');
      closeContextMenu();
      return;
    }
    window.dispatchEvent(
      new CustomEvent('deleteNode', { detail: { nodeId: id } })
    );
    closeContextMenu();
  };

  const handleCreateDoc = () => {
    setDocModal({ title: '', content: '' });
    closeContextMenu();
  };

  const handleSaveDoc = () => {
    if (!docModal?.title) {
      alert('请输入文档标题');
      return;
    }
    window.dispatchEvent(
      new CustomEvent('saveDoc', {
        detail: {
          nodeId: id,
          document: { title: docModal.title, content: docModal.content },
        },
      })
    );
    setDocModal(null);
  };

  const handleOpenDoc = () => {
    if (data.document) {
      setDocModal({ title: data.document.title, content: data.document.content });
    }
  };

  const handleNodeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('selectNode', { detail: { nodeId: id } })
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
      onClick={handleNodeClick}
      className={`inline-flex flex-col items-center gap-2 px-3 py-2 rounded ${
        isRoot ? 'bg-blue-500' : 'bg-gray-800'
      } text-white ${selected ? 'border-2 border-blue-500' : 'border-none'} ${
        isHovered && !selected ? 'border-2 border-blue-300' : ''
      } relative box-border cursor-pointer w-64`}
    >
      <div className="flex items-center gap-2 w-full">
        <textarea
          ref={textareaRef}
          value={label}
          onChange={onChange}
          onClick={(e) => e.stopPropagation()}
          className="bg-transparent border-none text-white font-medium outline-none resize-none w-full leading-tight overflow-hidden"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            lineHeight: '1.2',
          }}
        />
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(
                new CustomEvent('toggleCollapse', { detail: { nodeId: id } })
              );
            }}
            className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 cursor-pointer"
          >
            {data.collapsed ? data.children.length : '<'}
          </span>
        )}
        {(isHovered || selected) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(
                new CustomEvent('addChild', { detail: { parentId: id } })
              );
            }}
            className="bg-blue-500 text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            +
          </button>
        )}
      </div>

      {data.document && (
        <div
          className="text-sm text-blue-300 cursor-pointer hover:underline mt-1 w-full truncate"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDoc();
          }}
        >
          {data.document.title}
        </div>
      )}

      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />

      {contextMenu?.visible && (
        <div
          className="absolute bg-gray-700 text-white rounded shadow-lg w-48 z-10"
          style={{ top: '50%', left: '50%' }}
          onMouseLeave={closeContextMenu}
        >
          <div
            className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
            onClick={handleDeleteNode}
          >
            <span>删除节点</span>
            <span className="text-gray-400 text-sm">Delete</span>
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
            onClick={handleCreateDoc}
          >
            <span>创建文档</span>
            <span className="text-gray-400 text-sm">Ctrl + D</span>
          </div>
        </div>
      )}

      {docModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 w-96">
          <div className="bg-white rounded-lg p-4 w-96">
            <input
              type="text"
              value={docModal.title}
              onChange={(e) => setDocModal({ ...docModal, title: e.target.value })}
              placeholder="文档标题"
              className="w-full border p-2 mb-2 rounded text-black"
            />
            <textarea
              value={docModal.content}
              onChange={(e) => setDocModal({ ...docModal, content: e.target.value })}
              placeholder="文档内容"
              className="w-full border p-2 rounded h-40 text-black"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setDocModal(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                取消
              </button>
              <button
                onClick={handleSaveDoc}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const initialNodes: Node<NodeData>[] = [
  { id: 'root', type: 'mindmap', data: { label: 'work', children: ['xw', 'programming language', 'ai'] }, position: { x: 0, y: 0 } },
  { id: 'xw', type: 'mindmap', data: { label: 'xw', children: ['jx'], count: 1 }, position: { x: 0, y: 0 } },
  { id: 'jx', type: 'mindmap', data: { label: '浏览器测测最近是否正常 在浏览器更新系统前测过正常，先行不同的功能有先测同一个有详情', count: 1 }, position: { x: 0, y: 0 } },
  { id: 'programming language', type: 'mindmap', data: { label: 'programming language', children: ['function node', 'orderchain', 'function'], count: 24 }, position: { x: 0, y: 0 } },
  { id: 'function node', type: 'mindmap', data: { label: 'function node', count: 1 }, position: { x: 0, y: 0 } },
  { id: 'orderchain', type: 'mindmap', data: { label: 'orderchain性能更好' }, position: { x: 0, y: 0 } },
  { id: 'function', type: 'mindmap', data: { label: '功能性' }, position: { x: 0, y: 0 } },
  { id: 'ai', type: 'mindmap', data: { label: 'ai', count: 15 }, position: { x: 0, y: 0 } },
];

const initialEdges: Edge[] = [
  { id: 'e-root-xw', source: 'root', target: 'xw' },
  { id: 'e-xw-jx', source: 'xw', target: 'jx' },
  { id: 'e-root-programming-language', source: 'root', target: 'programming language' },
  { id: 'e-programming-language-function-node', source: 'programming language', target: 'function node' },
  { id: 'e-programming-language-orderchain', source: 'programming language', target: 'orderchain' },
  { id: 'e-programming-language-function', source: 'programming language', target: 'function' },
  { id: 'e-root-ai', source: 'root', target: 'ai' },
];

const layoutNodes = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  nodeHeights: Map<string, number>
): Node<NodeData>[] => {
  const nodeMap = new Map<string, Node<NodeData>>();
  nodes.forEach((node) => nodeMap.set(node.id, { ...node }));

  // 使用外部传入的真实高度
  const nodeSizes = new Map<string, { width: number; height: number }>();
  nodes.forEach((node) => {
    const height = nodeHeights.get(node.id) || 20; // 单行默认高度20px
    const extraHeight = node.data.document ? 20 : 0; // 文档标题额外高度
    nodeSizes.set(node.id, { width: 256, height: height + extraHeight });
  });

  const levelSpacing = 300; // 固定水平间距
  const siblingSpacing = 60; // 固定垂直间距

  const getSubtreeHeight = (nodeId: string, visited = new Set<string>()): number => {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node || !node.data.children || node.data.children.length === 0 || node.data.collapsed) {
      return nodeSizes.get(nodeId)?.height || 20;
    }
    const childrenHeights = node.data.children.map((childId) => getSubtreeHeight(childId, visited));
    return (
      childrenHeights.reduce((sum, height) => sum + height, 0) +
      (childrenHeights.length > 0 ? (childrenHeights.length - 1) * siblingSpacing : 0)
    );
  };

  const layoutLevel = (
    nodeId: string,
    depth: number,
    yOffset: number,
    visited = new Set<string>()
  ): { height: number; yOffset: number } => {
    if (visited.has(nodeId)) return { height: 0, yOffset };
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return { height: 0, yOffset };

    node.position.x = depth * levelSpacing;
    const nodeHeight = nodeSizes.get(nodeId)?.height || 20;

    if (!node.data.children || node.data.children.length === 0 || node.data.collapsed) {
      node.position.y = yOffset + nodeHeight / 2;
      return { height: nodeHeight, yOffset: yOffset + nodeHeight };
    }

    let currentYOffset = yOffset;
    const childPositions: { id: string; y: number }[] = [];

    node.data.children.forEach((childId) => {
      const { height: childHeight, yOffset: newYOffset } = layoutLevel(childId, depth + 1, currentYOffset);
      const childNode = nodeMap.get(childId);
      if (childNode) {
        childPositions.push({ id: childId, y: childNode.position.y });
      }
      currentYOffset = newYOffset + siblingSpacing;
    });

    const totalHeight =
      node.data.children.length > 0
        ? childPositions[childPositions.length - 1].y -
          childPositions[0].y +
          nodeSizes.get(node.data.children[node.data.children.length - 1])!.height
        : nodeHeight;

    node.position.y =
      node.data.children.length > 0
        ? childPositions[0].y + (childPositions[childPositions.length - 1].y - childPositions[0].y) / 2
        : yOffset + nodeHeight / 2;

    return { height: totalHeight, yOffset: currentYOffset - siblingSpacing };
  };

  const rootHeight = getSubtreeHeight('root');
  layoutLevel('root', 0, -rootHeight / 2);
  return Array.from(nodeMap.values());
};

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [layoutTrigger, setLayoutTrigger] = useState(0);
  const [nodeHeights, setNodeHeights] = useState<Map<string, number>>(new Map());

  const triggerLayout = useCallback(() => {
    setLayoutTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setNodes((nds) => {
      const newNodes = layoutNodes(nds, edges, nodeHeights);
      if (JSON.stringify(newNodes) === JSON.stringify(nds)) return nds;
      return newNodes;
    });
  }, [layoutTrigger, edges, nodeHeights]);

  useEffect(() => {
    const handleAddChild = (event: CustomEvent<{ parentId: string }>) => {
      const { parentId } = event.detail;
      const newNodeId = `node-${Date.now()}`;
      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: 'mindmap',
        data: { label: '新节点' },
        position: { x: 0, y: 0 },
      };
      const newEdge: Edge = { id: `${parentId}-${newNodeId}`, source: parentId, target: newNodeId };

      setNodes((nds) => {
        const updatedNodes = nds.map((n) =>
          n.id === parentId
            ? { ...n, data: { ...n.data, children: [...(n.data.children || []), newNodeId] } }
            : n
        );
        return [...updatedNodes, newNode];
      });
      setEdges((eds) => [...eds, newEdge]);
      triggerLayout();
    };

    const handleDeleteNode = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      const getAllDescendantIds = (nodeId: string, nodes: Node<NodeData>[], edges: Edge[]): string[] => {
        const descendants: string[] = [];
        const queue = [nodeId];
        while (queue.length > 0) {
          const currentId = queue.shift()!;
          const node = nodes.find((n) => n.id === currentId);
          if (node?.data.children) {
            queue.push(...node.data.children);
            descendants.push(...node.data.children);
          }
        }
        return descendants;
      };

      setNodes((nds) => {
        const descendantIds = getAllDescendantIds(nodeId, nds, edges);
        const idsToDelete = [nodeId, ...descendantIds];
        const updatedNodes = nds.map((n) => {
          if (n.data.children && n.data.children.includes(nodeId)) {
            return {
              ...n,
              data: { ...n.data, children: n.data.children.filter((childId) => childId !== nodeId) },
            };
          }
          return n;
        });
        return updatedNodes.filter((n) => !idsToDelete.includes(n.id));
      });

      setEdges((eds) => {
        const descendantIds = getAllDescendantIds(nodeId, nodes, eds);
        const idsToDelete = [nodeId, ...descendantIds];
        return eds.filter((e) => !idsToDelete.includes(e.source) && !idsToDelete.includes(e.target));
      });

      setNodeHeights((prev) => {
        const newHeights = new Map(prev);
        const descendantIds = getAllDescendantIds(nodeId, nodes, edges);
        [nodeId, ...descendantIds].forEach((id) => newHeights.delete(id));
        return newHeights;
      });

      triggerLayout();
    };

    const handleToggleCollapse = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } } : n
        )
      );
      triggerLayout();
    };

    const handleSelectNode = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === nodeId })));
    };

    const handleSaveDoc = (event: CustomEvent<{ nodeId: string; document: DocumentData }>) => {
      const { nodeId, document } = event.detail;
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, document } } : n))
      );
      triggerLayout();
    };

    const handleUpdateNodeSize = (event: CustomEvent<{ nodeId: string; height: number }>) => {
      const { nodeId, height } = event.detail;
      setNodeHeights((prev) => {
        const newHeights = new Map(prev);
        newHeights.set(nodeId, height);
        return newHeights;
      });
      triggerLayout();
    };

    window.addEventListener('addChild', handleAddChild as EventListener);
    window.addEventListener('deleteNode', handleDeleteNode as EventListener);
    window.addEventListener('toggleCollapse', handleToggleCollapse as EventListener);
    window.addEventListener('selectNode', handleSelectNode as EventListener);
    window.addEventListener('saveDoc', handleSaveDoc as EventListener);
    window.addEventListener('updateNodeSize', handleUpdateNodeSize as EventListener);

    return () => {
      window.removeEventListener('addChild', handleAddChild as EventListener);
      window.removeEventListener('deleteNode', handleDeleteNode as EventListener);
      window.removeEventListener('toggleCollapse', handleToggleCollapse as EventListener);
      window.removeEventListener('selectNode', handleSelectNode as EventListener);
      window.removeEventListener('saveDoc', handleSaveDoc as EventListener);
      window.removeEventListener('updateNodeSize', handleUpdateNodeSize as EventListener);
    };
  }, [triggerLayout, nodes, edges]);

  const onNodesChange: OnNodesChange<NodeData> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const visibleEdges = edges.filter((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode) return true;
    return !sourceNode.data.collapsed;
  });

  const visibleNodes = nodes.filter((node) => {
    const pathToRoot: string[] = [];
    let currentNode = node;
    while (currentNode) {
      pathToRoot.push(currentNode.id);
      const parentEdge = edges.find((e) => e.target === currentNode.id);
      if (!parentEdge) break;
      currentNode = nodes.find((n) => n.id === parentEdge.source)!;
    }
    return !pathToRoot.some((id) => {
      const n = nodes.find((node) => node.id === id);
      return n?.data.collapsed && id !== node.id;
    });
  });

  return (
    <div className="h-screen w-screen bg-gray-900">
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ mindmap: MindMapNode }}
        defaultEdgeOptions={{ style: { stroke: '#1890ff' } }}
        fitView
        nodesDraggable={false}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default App;