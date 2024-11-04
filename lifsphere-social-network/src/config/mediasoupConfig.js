// mediasoupConfig.js
const { Server } = require('mediasoup');

const mediasoupConfig = {
    // Worker configuration
    worker: {
        rtcMinPort: 10000,
        rtcMaxPort: 20000,
        logLevel: 'warn', // 'debug' | 'warn' | 'error' | 'fatal'
        logTags: [
            // List of tags to enable specific logging
            'info', 'error', 'warn'
        ]
    },

    // Router configuration
    router: {
        // Define codecs to be used
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
                parameters: {
                    'useinbandfec': 1,
                    'maxplaybackrate': 48000,
                    'stereo': 1,
                },
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000,
                },
            },
            {
                kind: 'video',
                mimeType: 'video/H264',
                clockRate: 90000,
                parameters: {
                    'profile-level-id': '42e01f', // H264 profile
                    'level-asymmetry-allowed': 1,
                    'packetization-mode': 1,
                },
            },
        ],
    },

    // Transport configuration
    transport: {
        // Define options for WebRTC transports
        enableUdp: true,
        enableTcp: true,
        maxIncomingBitrate: 1500000, // 1.5 Mbps
        maxOutgoingBitrate: 1500000, // 1.5 Mbps
    },
};

module.exports = mediasoupConfig;
