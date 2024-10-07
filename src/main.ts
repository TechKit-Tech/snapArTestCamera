import { bootstrapCameraKit } from '@snap/camera-kit';

(async function () {
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzI1NTIzMzcxLCJzdWIiOiJmZjFjMjFmZC1mYjMyLTRlM2UtOWI4NC02NjA2M2Q2ZDM1MjB-U1RBR0lOR35lZDJlZWQ3Ny01YmU2LTRjMTctOTVhOC1mZThhOGJhYWEzMDgifQ.wiHwnA2zbvG9n67oDhGwCoxaQQuKpdzJX2t-lXH0lc0' });

    const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
    const flipCamera = document.getElementById('flip');
    let isBackFacing = true;

    const session = await cameraKit.createSession({ liveRenderTarget });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });

    await session.setSource(mediaStream);
    await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
        "d084d5f9-ff0e-4404-8ec6-98285760baaf",
        "264c3a8d-a009-46ac-b54b-e9ba3590309d"
    );
    await session.applyLens(lens);
})();

// import { bootstrapCameraKit } from "@snap/camera-kit";

// (
//     async function () {
//         const cameraKit = await bootstrapCameraKit({
//             apiToken: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzI1NTIzMzcxLCJzdWIiOiJmZjFjMjFmZC1mYjMyLTRlM2UtOWI4NC02NjA2M2Q2ZDM1MjB-U1RBR0lOR35lZDJlZWQ3Ny01YmU2LTRjMTctOTVhOC1mZThhOGJhYWEzMDgifQ.wiHwnA2zbvG9n67oDhGwCoxaQQuKpdzJX2t-lXH0lc0"
//         });

//         const liveRenderTraget = document.getElementById('canvas') as HTMLCanvasElement;
//         const session = await cameraKit.createSession({ liveRenderTraget });

//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//             video: {
//                 facingMode: "user"
//             }
//         })

//         await session.setSource(mediaStream);
//         await session.play();

//         const lens = await cameraKit.lensRepository.loadLens("264c3a8d-a009-46ac-b54b-e9ba3590309d", "f233ef9a-b4a5-4dd0-a814-ca074e7985d7");
//         await session.applyLens(lens);

//     }
// )();
