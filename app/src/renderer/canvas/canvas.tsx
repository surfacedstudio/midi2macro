import React, { useRef, useEffect } from 'react';

var mouseX = 0;
var mouseY = 0;

function Canvas(props: any) {
  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, 0); // Begin first sub-path
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.moveTo(0, 0); // Begin second sub-path
    ctx.arc(mouseX, mouseY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.fill();

    // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    // ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.scale(1, 1);
    let frameCount = 0;
    let animationFrameId;

    //Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * 1;
      mouseY = (e.clientY - rect.top) * 1;

      console.log(`Mouse move ${mouseX}, ${mouseY}`);
    });

    console.log(`CANVAS SIZE ${canvas.width} x ${canvas.height}`);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <canvas
      style={{ width: '100vw', height: '100vh' }}
      width="1280"
      height="739"
      ref={canvasRef}
      {...props}
    />
  );
}

export default Canvas;
