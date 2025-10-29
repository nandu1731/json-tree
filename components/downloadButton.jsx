import { getNodesBounds, getViewportForBounds, Panel, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton({ isDisabled }) {
  const { getNodes } = useReactFlow();

  const onClick = async () => {
    const nodes = getNodes();
    if (!nodes.length) return;

    const nodesBounds = getNodesBounds(nodes);

    const padding = 20;
    const imageWidth = nodesBounds.width + padding * 8;
    const imageHeight = nodesBounds.height + padding * 8;

    // Viewport calculation (no zoom-out)
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.01, // keep tiny padding around
      1 // do not zoom out
    );

    await new Promise(resolve => setTimeout(resolve, 300));

    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        transformOrigin: '0 0',
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className="inline-flex h-10 items-center justify-center rounded-full border border-white bg-[#2b7fff] px-4 font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-[#418dff] hover:shadow-md active:bg-[#1a5edb] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-70"
      >
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;
