import * as Yup from "yup";

const inventorySchema = Yup.object().shape({
    id: Yup.string()
      .uuid("L'ID doit être un UUID valide")
      .required("L'ID est requis"),
    qunatity: Yup.integer().min(0, "La quantité doit être supérieure à 0").required("La quantité est requise"),
available_quantity: Yup.integer().min(0, "La quantité disponible doit être supérieure à 0").required("La quantité disponible est requise"),});