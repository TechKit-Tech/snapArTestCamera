import {
    bootstrapCameraKit,
    CameraKitSession,
    createMediaStreamSource,
    Transform2D,
} from '@snap/camera-kit';

const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
const flipCamera = document.getElementById('flip');

let isBackFacing = true;
let mediaStream: MediaStream;

async function init() {
    const cameraKit = await bootstrapCameraKit({
        apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzI1NTIzMzcxLCJzdWIiOiJmZjFjMjFmZC1mYjMyLTRlM2UtOWI4NC02NjA2M2Q2ZDM1MjB-U1RBR0lOR35lZDJlZWQ3Ny01YmU2LTRjMTctOTVhOC1mZThhOGJhYWEzMDgifQ.wiHwnA2zbvG9n67oDhGwCoxaQQuKpdzJX2t-lXH0lc0',
    });

    const session = await cameraKit.createSession({ liveRenderTarget });
    const lens = await cameraKit.lensRepository.loadLens(
        "d084d5f9-ff0e-4404-8ec6-98285760baaf",
        "264c3a8d-a009-46ac-b54b-e9ba3590309d"
    );

    session.applyLens(lens);

    bindFlipCamera(session);
}

function bindFlipCamera(session: CameraKitSession) {
    flipCamera.style.cursor = 'pointer';

    flipCamera.addEventListener('click', () => {
        updateCamera(session);
    });

    updateCamera(session);
}

async function updateCamera(session: CameraKitSession) {
    isBackFacing = !isBackFacing;

    flipCamera.innerText = isBackFacing
        ? 'Switch to Front Camera'
        : 'Switch to Back Camera';

    if (mediaStream) {
        session.pause();
        mediaStream.getVideoTracks()[0].stop();
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: isBackFacing ? 'environment' : 'user',
        },
    });

    const source = createMediaStreamSource(mediaStream, {
        // NOTE: This is important for world facing experiences
        cameraType: isBackFacing ? 'back' : 'front',
    });

    await session.setSource(source);

    if (!isBackFacing) {
        source.setTransform(Transform2D.MirrorX);
    }

    session.play();
}

init();