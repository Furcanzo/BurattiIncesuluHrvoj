import {ManagerAppState} from "./models";
import {button, card, centered, formField, inlineForm, pillSelection, row, text, titleText} from "../widgets";
import {
    ChangeStaffType,
    SetNewMemberAs,
    SubmitNewMember,
    UpdateNewMemberEmail,
} from "./actions";

export const manageStaffView = ({staffMembers, newMember}: ManagerAppState) => {

    return [
        titleText("Manage Staff", "3"),
        inlineForm([
            ...staffMembers.map((member) => {
                return row([
                    titleText(member.email, "4"),
                    button(member.role === "clerk" ? "Promote to Manager" : "Make a Clerk", "primary", ChangeStaffType)
                ])
            })
        ]),
        row(card(titleText("Add Staff Member", "4"), [
            inlineForm(row(formField(newMember.email, "Email", UpdateNewMemberEmail))),
            pillSelection([{
                content: text("Manager"),
                active: newMember.role === "manager",
                onClick: SetNewMemberAs("manager")
            }, {
                content: text("Clerk"),
                active: newMember.role === "clerk",
                onClick: SetNewMemberAs("clerk"),
            }]),
            row(centered(button("Add", "success", SubmitNewMember))),
        ]),)
    ]
}
