import multerService from "../../application/services/multer.service"

export const multerUserUpdateProfile = multerService.upload([
    { name: 'files', maxCount: 1 },
])