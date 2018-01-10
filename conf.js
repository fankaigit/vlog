const HOST=`${window.location.protocol}//${window.location.hostname}:${location.port}`

export default {
  urls: {
    data: `${HOST}/s/vlog/data/1`,
    login: `${HOST}/s/login`,
    logout: `${HOST}/s/logout`,
    register: `${HOST}/s/register`,
    status: `${HOST}/s/status`
  }
}
