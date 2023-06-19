export const getBaseConfiguration = () => {
  const { API_VERSION, PORT, DB_CNN, DB_NAME, CURSO, NODE_ENV } = process.env;

  return {
    API_VERSION,
    CURSO,
    DB_CNN,
    DB_NAME,
    NODE_ENV,
    PORT,
  };
};
