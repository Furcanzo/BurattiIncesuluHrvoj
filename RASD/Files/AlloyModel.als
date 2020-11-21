abstract sig Store {
	sections : some Section
}

one sig PrimaryStore extends Store{
	partnerStores : set PartnerStore
}

sig PartnerStore extends Store {}

sig Section {
	maxCapacity: one Int
}{
	maxCapacity > 0
}

sig Email {}

sig Password {}

abstract sig User {
	email : one Email,
	password : one Password
}

sig Customer extends User {}

sig Manager extends User {
	store : one Store
}

sig Clerk extends User {
	manager : one Manager,
	store : one Store
}{
	manager.store = store
}

abstract sig AccessTitle{
	customer : one Customer,
	sections: some Section,
	estimatedEnterTime : one Time,
	estimatedExitTime: one Time,
}{
	estimatedEnterTime.timestamp < estimatedExitTime.timestamp
}

sig Ticket extends AccessTitle{
	lineNumber : one ActualLineNumber
}

sig Booking extends AccessTitle{
	lineNumber : one BookedLineNumber
}{
	estimatedEnterTime.timestamp > lineNumber.timeSlot.start.timestamp
	estimatedEnterTime.timestamp < lineNumber.timeSlot.end.timestamp
}

sig Visit{
	accessTitle : one AccessTitle,
	enterTime : one Time,
	exitTime : lone Time
}{
	enterTime.timestamp < exitTime.timestamp
}

//UTC standard format: number of seconds from 1970/01/01 00:00:00
sig Time {
	timestamp : one Int
}{
	timestamp>=0
}

sig TimeSlot {
	start : one Time,
	end : one Time
}{
	start.timestamp < end.timestamp
}

abstract sig LineNumber {
	timeSlot : one TimeSlot,
	number : one Int
}{
	number > 0
}

sig ActualLineNumber extends LineNumber{}

sig BookedLineNumber extends LineNumber{}

fact credentialInUsers {
	all mail : Email | mail in User.email
	all pw : Password | pw in User.password
	no mail : Email, disj user1, user2 : User | mail in user1.email && mail in user2.email
}

fact everySectionInAStore {
	all section : Section | section in Store.sections
	no section : Section, disj store1, store2 : Store | section in store1.sections && section in store2.sections
}

fact everyLineNumberInAnAccessTitle {
	all ln : LineNumber | ln in (Ticket.lineNumber + Booking.lineNumber)
	all ln1, ln2 :LineNumber | ln1.number = ln2.lineNumber => ln1.timeSlot != ln2.timeSlot
}


fact everyPartnerSoreInAPrimaryStore {
	all partnerStore : PartnerStore | partnerStore in PrimaryStore.partnerStores
}

fact bookOnlyAStore {
	all accessTitle : AccessTitle | one store : Store | accessTitle.sections in store.sections
}

fact consistenQueue { // maybe assertion
	all disj at1, at2 : AccessTitle |
		((at1<:Ticket).lineNumber.number < (at2<:Ticket).lineNumber.number && (at1<:Ticket).lineNumber.timeSlot = (at2<:Ticket).lineNumber.timeSlot) =>
			at1.estimatedEnterTime.timestamp =< at2.estimatedEnterTime.timestamp
	
	all disj at1, at2 : AccessTitle |
		((at1<:Booking).lineNumber.number < (at2<:Booking).lineNumber.number && (at1<:Booking).lineNumber.timeSlot = (at2<:Booking).lineNumber.timeSlot) =>
			at1.estimatedEnterTime.timestamp =< at2.estimatedEnterTime.timestamp
}

fact socialDistance { // maybe assetion
	all  time : Time, section : Section |
		#{c: Customer | c in 
		{visit : Visit | 
			((visit.enterTime.timestamp < time.timestamp && visit.exitTime.timestamp> time.timestamp) ||
			(visit.enterTime.timestamp < time.timestamp && visit.accessTitle.estimatedExitTime.timestamp> time.timestamp) ||
			(visit.accessTitle.estimatedEnterTime.timestamp < time.timestamp && visit.accessTitle.estimatedExitTime.timestamp> time.timestamp) )&&
			section in visit.accessTitle.sections
		}.accessTitle.customer
	 } =< section.maxCapacity
}

pred show{

}

//check socialDistance
run show for 10
