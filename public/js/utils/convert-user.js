module.exports = function(model){
	return (model) ? model.toJSON() : null;
};