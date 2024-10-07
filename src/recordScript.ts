import { bootstrapCameraKit, createMediaStreamSource } from '@snap/camera-kit';

const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
const videoContainer = document.getElementById(
    'video-container'
) as HTMLElement;
const videoTarget = document.getElementById('video') as HTMLVideoElement;
const startRecordingButton = document.getElementById(
    'start'
) as HTMLButtonElement;
const stopRecordingButton = document.getElementById(
    'stop'
) as HTMLButtonElement;
const downloadButton = document.getElementById('download') as HTMLButtonElement;

let mediaRecorder: MediaRecorder;
let downloadUrl: string;

async function init() {
    const cameraKit = await bootstrapCameraKit({
        apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzI1NTIzMzcxLCJzdWIiOiJmZjFjMjFmZC1mYjMyLTRlM2UtOWI4NC02NjA2M2Q2ZDM1MjB-U1RBR0lOR35lZDJlZWQ3Ny01YmU2LTRjMTctOTVhOC1mZThhOGJhYWEzMDgifQ.wiHwnA2zbvG9n67oDhGwCoxaQQuKpdzJX2t-lXH0lc0',
    });

    const session = await cameraKit.createSession({ liveRenderTarget });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });

    const source = createMediaStreamSource(mediaStream);

    await session.setSource(source);
    await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
        "64c9232c-80cb-470d-b82d-f93dbe55a259",
        "264c3a8d-a009-46ac-b54b-e9ba3590309d"
    );

    session.applyLens(lens);

    bindRecorder();
}

function bindRecorder() {
    startRecordingButton.addEventListener('click', () => {
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
        downloadButton.disabled = true;
        videoContainer.style.display = 'none';

        const mediaStream = liveRenderTarget.captureStream(30);

        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener('dataavailable', (event) => {
            if (!event.data.size) {
                console.warn('No recorded data available');
                return;
            }

            const blob = new Blob([event.data]);

            downloadUrl = window.URL.createObjectURL(blob);
            downloadButton.disabled = false;

            videoTarget.src = downloadUrl;
            videoContainer.style.display = 'block';
        });

        mediaRecorder.start();
    });

    stopRecordingButton.addEventListener('click', () => {
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;

        mediaRecorder?.stop();
    });

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');

        link.setAttribute('style', 'display: none');
        link.href = downloadUrl;
        link.download = 'camera-kit-web-recording.webm';
        link.click();
        link.remove();
    });
}

init();