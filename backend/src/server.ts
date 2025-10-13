import app from "./app";
import useMongoUtils from "./utils/mongo";

const PORT = process.env.PORT;
(async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
