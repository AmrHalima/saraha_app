export default class Repository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findOne(filters, select = {}) {
        return this.model.findOne(filters).select(select);
    }
    findById(ID) {
        return this.model.findById(String(ID));
    }
    find(filters) {
        return this.model.find(filters);
    }
    insertMany(data) {
        return this.model.insertMany(data);
    }
    updateOne(filters, updateData, options = {}) {
        return this.model.updateOne(filters, updateData, options);
    }
    updateMany(filters, updateData, options = {}) {
        return this.model.updateMany(filters, updateData, options);
    }
    findByIdAndUpdate(ID, updateData, options = { new: true }) {
        return this.model.findByIdAndUpdate(String(ID), updateData, options);
    }
    findOneAndUpdate(filters, updateData, options = { new: true }) {
        return this.model.findOneAndUpdate(filters, updateData, options);
    }
    deleteOne(filters) {
        return this.model.deleteOne(filters);
    }
    deleteMany(filters) {
        return this.model.deleteMany(filters);
    }
    findByIdAndDelete(ID) {
        return this.model.findByIdAndDelete(String(ID));
    }
    countDocuments(filters) {
        return this.model.countDocuments(filters);
    }
    exists(filters) {
        return this.model.exists(filters);
    }
}
