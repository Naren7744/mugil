const { calculateFinance } = require("./financeSummary");

const buildSummary = (members, period) => {

    const finance = calculateFinance(members, period);

    return {

        collection: finance.collection,

        outstanding: finance.outstanding,

        highestDue: finance.highestDue,

        cash: finance.cash,

        online: finance.online,

        activeMembers: finance.activeMembers

    };

};

module.exports = {
    buildSummary
};