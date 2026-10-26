import type {Config} from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  basename: '/ChosenPicachu/',
  ssr: false,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true
  }
} satisfies Config;
