export const getBaseConfiguration = () => {
  const { API_VERSION, PORT, DB_CNN, DB_NAME, CURSO, NODE_ENV, SIGNING_SECRET } = process.env;

  return {
    API_VERSION,
    CURSO,
    DB_CNN,
    DB_NAME,
    NODE_ENV,
    PORT,
    SIGNING_SECRET,
  };
};
