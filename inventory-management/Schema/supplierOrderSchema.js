import * as Yup from "yup";

const supplierOrderSchema = Yup.object().shape({
    id: Yup.string()
      .uuid("L'ID doit être un UUID valide")
      .required("L'ID est requis")});