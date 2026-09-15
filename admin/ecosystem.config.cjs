module.exports = {
  apps: [
    {
      name: 'Admin',
      script: './.output/server/index.mjs',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3101,
        HOST: '0.0.0.0',
      },
    },
  ],
};

