const inProgress = {};

module.exports = {
    /**
     * Marks the annotation as in progress
     * so no other agents pick up the task
     */
    markInProgress: id => {
        // TODO: Persist :)
        inProgress[id] = true;
    },

    isInProgress: id => {
        return inProgress[id] === true;
    }
}