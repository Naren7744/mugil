const getMemberStatus = require("./memberStatus");
const { isDateInPeriod } = require("./dateFilter");

const calculateFinance = (members, period="overall")=>{

    let collection=0;
    let cash=0;
    let online=0;
    let outstanding=0;
    let highestDue=0;
    let activeMembers=0;

    members.forEach(member=>{
  console.log("Member:", member.fullName);

 const status = getMemberStatus(member.expiryDate);

if (status !== "Expired") {
    activeMembers++;
}


       if (status !== "Expired") {
    outstanding += Number(member.balanceAmount || 0);

    if (Number(member.balanceAmount || 0) > highestDue) {
        highestDue = Number(member.balanceAmount || 0);
    }
}


        if(Number(member.balanceAmount||0)>highestDue){
            highestDue=Number(member.balanceAmount||0);
        }

        (member.paymentHistory||[]).forEach(payment=>{

            if(!isDateInPeriod(payment.paymentDate,period))
                return;

          const amount = Number(payment.amount ?? 0);

if (isNaN(amount))
    return;

            collection+=amount;

            const mode = (
  payment.paymentMethod ||
  payment.paymentMode ||
  ""
)
.trim()
.toLowerCase();

if (mode === "cash") {
    cash += amount;
} else {
    online += amount;
}

        });

    });
console.log("Final Collection:", collection);
    return{

        activeMembers,
        collection,
        outstanding,
        highestDue,
        cash,
        online

    };

};

module.exports={
    calculateFinance
};