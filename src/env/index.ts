const realEnv = process.env.REAL_ENV

const env = {
    zsh: 'http://localhost:7001',
    realEnv,
    isDev: realEnv !== 'production'
}

if (!env.isDev) {
    env.zsh = ''
}

export default env
