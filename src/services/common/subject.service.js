import api from "../auth/api.service";

const subjectService = {
getAll() {
return api.get("/subjects");
},

search(search) {
return api.get("/subjects/search", {
params: {
search,
},
});
},
};

export default subjectService;