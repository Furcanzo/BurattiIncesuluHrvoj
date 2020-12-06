//Signatures-------------------------------------------------------------------------------------------------------------------------

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

some sig Manager extends User {
	store : one Store
}

some sig Clerk extends User {
	manager : one Manager,
	store : one Store
}{
	manager.store = store
}

abstract sig AccessTitle{
	customer : lone Customer,
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
	#customer = 1
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
	number >= 0
}

sig ActualLineNumber extends LineNumber{}

sig BookedLineNumber extends LineNumber{}

//Facts-------------------------------------------------------------------------------------------------------------------------

fact credentialInUsers {
	all mail : Email | mail in User.email
	all pw : Password | pw in User.password
	no mail : Email, disj user1, user2 : User | mail in user1.email && mail in user2.email
	no pw : Password, disj user1, user2 : User | pw in user1.password && pw in user2.password
}

fact everySectionInAStore {
	all section : Section | section in Store.sections
	no section : Section, disj store1, store2 : Store | section in store1.sections && section in store2.sections
}

fact everyLineNumberInAnAccessTitle {
	all ln : LineNumber | ln in (Ticket.lineNumber + Booking.lineNumber)
	no ln: LineNumber, disj t1, t2 : Ticket | ln in t1.lineNumber && ln in t2.lineNumber
	no ln: LineNumber, disj t1, t2 : Booking | ln in t1.lineNumber && ln in t2.lineNumber
	all disj ln1, ln2 :LineNumber | ln1.number = ln2.number => ln1.timeSlot != ln2.timeSlot
}

fact AVisitForEachAccessTitle {
	no at: AccessTitle, disj visit1, visit2 : Visit | at in visit1.accessTitle && at in visit2.accessTitle
}

fact everyPartnerSoreInAPrimaryStore {
	all partnerStore : PartnerStore | partnerStore in PrimaryStore.partnerStores
}

fact bookOnlyAStore {
	all accessTitle : AccessTitle | one store : Store | accessTitle.sections in store.sections
}

fact consistentQueue {
	all disj at1, at2 : AccessTitle |
		((at1<:Ticket).lineNumber.number < (at2<:Ticket).lineNumber.number && (at1<:Ticket).lineNumber.timeSlot = (at2<:Ticket).lineNumber.timeSlot) =>
			at1.estimatedEnterTime.timestamp =< at2.estimatedEnterTime.timestamp
	
	all disj at1, at2 : AccessTitle |
		((at1<:Booking).lineNumber.number < (at2<:Booking).lineNumber.number && (at1<:Booking).lineNumber.timeSlot = (at2<:Booking).lineNumber.timeSlot) =>
			at1.estimatedEnterTime.timestamp =< at2.estimatedEnterTime.timestamp
}

fact noOverBooking {
	all  time : Time, section : Section |
		#{at : AccessTitle | at in 
			{visit : Visit | 
				((visit.enterTime.timestamp =< time.timestamp && visit.exitTime.timestamp>= time.timestamp) ||
				(visit.enterTime.timestamp =< time.timestamp && visit.accessTitle.estimatedExitTime.timestamp>= time.timestamp) ||
				(visit.accessTitle.estimatedEnterTime.timestamp =< time.timestamp && visit.accessTitle.estimatedExitTime.timestamp>= time.timestamp) )&&
				section in visit.accessTitle.sections
			}.accessTitle
		 } =< section.maxCapacity
}

fact equallyLongTimeSlots{
	all ts1, ts2 : TimeSlot | ts1.end-ts1.start = ts2.end-ts2.start
}

//Assertions-------------------------------------------------------------------------------------------------------------------------

assert noMoreVisitsThanAccessTitle {
	#Visit =< #AccessTitle
}
check noMoreVisitsThanAccessTitle

assert atLeastACustomerForHavingAnAccessTitle {
	#Customer = 0 => #Booking=0
}
check atLeastACustomerForHavingAnAccessTitle

assert neverMoreCustomerThanMaxCapacity {
	all  time : Time, section : Section |
		#{c : Customer | c in 
			{visit : Visit | 
				((visit.enterTime.timestamp =< time.timestamp && visit.exitTime.timestamp>= time.timestamp) ||
				(visit.enterTime.timestamp =< time.timestamp && visit.accessTitle.estimatedExitTime.timestamp>= time.timestamp) ||
				(visit.accessTitle.estimatedEnterTime.timestamp =< time.timestamp && visit.accessTitle.estimatedExitTime.timestamp>= time.timestamp) )&&
				section in visit.accessTitle.sections
			}.accessTitle.customer
		 } =< section.maxCapacity
}
check neverMoreCustomerThanMaxCapacity

//Worlds-------------------------------------------------------------------------------------------------------------------------

//Normal Condition
pred world1{
	#PartnerStore=1
	#Section=3
	#User=5
	#Customer=3
	#AccessTitle=5
	#Visit=3
	#TimeSlot=5
}

//No Customers
pred world2{
	#Customer=0
}

//Saturated Store
pred world3{
	#PartnerStore=0
	#Section=1
	Section.maxCapacity=3
	#Visit=3
	no cus : Customer | cus not in AccessTitle.customer
	#TimeSlot=1
	#Time = 2
}

run world1 for 10
run world2 for 10
run world3 for 10

