const HOST=`${window.location.protocol}//${window.location.hostname}:${location.port}`

export default {
  urls: {
    login: `${HOST}/s/login`,
    logout: `${HOST}/s/logout`,
    register: `${HOST}/s/register`,
    status: `${HOST}/s/status`,
    data: `${HOST}/s/vlog/data`,
    template: `${HOST}/s/vlog/templates`
  }
}
