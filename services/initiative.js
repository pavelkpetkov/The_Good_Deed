const Initiative = require('../models/Initiative');


async function createInit(initData) {
    const initiative = new Initiative(initData);
    await initiative.save();
    return initiative;
}

async function getAllInits() {
    const initiatives = await Initiative.find({}).lean();
    return initiatives;
}

async function getAllEnvironmentInits() {
    const initiatives = await Initiative.find({ category: 'Environment'}).lean();
    return initiatives;
}

async function getAllSocietyInits() {
    const initiatives = await Initiative.find({ category: 'Society' }).lean();
    return initiatives;
}

async function getAllBeInspiredInits() {
    const initiatives = await Initiative.find({ category: 'Be inspired' }).lean();
    return initiatives;
}

async function getInitById(id) {
    const initiative = await Initiative.findById(id).lean();
    return initiative;
}

async function joinInit(initId, userEmail) {
    const initiative = await Initiative.findById(initId);

    initiative.joined.push(userEmail);

    return initiative.save();
}

async function deleteInit(id) {
    return Initiative.findByIdAndDelete(id);
}

async function editInit(id, initData) {
    const initiative = await Initiative.findById(id);
    console.log(initiative);
    initiative.category = initData.category.trim();
    initiative.title = initData.title.trim();
    initiative.location = initData.location.trim();
    initiative.image = initData.image.trim();
    initiative.date = initData.date.trim();
    initiative.time = initData.time.trim();
    initiative.description = initData.description.trim();

    console.log(initiative);
    return initiative.save();
}

module.exports = {
    createInit,
    getAllInits,
    getInitById,
    joinInit,
    deleteInit,
    editInit,
    getAllEnvironmentInits,
    getAllSocietyInits,
    getAllBeInspiredInits
}