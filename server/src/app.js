import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import depositorRoutes from "./routes/depositorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import artworkRoutes from "./routes/artworkRoutes.js";

const app = express();

app.use(cors({
  origin: "https://artwork-management-system-nwrjhu354-ash-e2ec.vercel.app"
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/depositors", depositorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/artworks", artworkRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Art Gallery API is running",
  });
});

export default app;
