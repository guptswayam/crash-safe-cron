function configuration() {
  return {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      connectionString: process.env.MONGODB_CONNECTION_STRING
    }
  }
}

export default configuration;

export type ConfigType = ReturnType<typeof configuration>