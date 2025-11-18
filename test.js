const repo = require('./src/repo/queue')
const usecase =require('./src/usecase/queue')


async function main() {
const date = new Date('2025-11-09T07:00:00.000Z');
date.setHours(0,0,0,0)

//await repo.create(";;lksa",1,1,0,date)
const result = await usecase.get_by_date(0,1,date)
//const result =await repo.update_status(13,2)
console.log(result)
}
main()