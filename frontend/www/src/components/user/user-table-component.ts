import { html, render } from "lit-html"
import { User } from "../../model/user"
import userService from "../../user-service"
import { store } from "Model/store"
import { distinctUntilChanged, map } from "rxjs"

export class UserTableComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        console.log("connected usertable")
        userService.fetchAll()
        store
            .pipe(
                distinctUntilChanged(undefined, model => model.users),
                map(model => model.users)
            )
            .subscribe(users => this.render(users))
    }
    render(users: Array<User>) {
        const userClicked = (user: User) => {
            this.dispatchEvent(new CustomEvent("user-selected", {detail: {user}}))
        }
        const rowTemplate = (user: User) => html`
            <tr @click=${() => userClicked(user)}>
            <td >${user.id}</td><td>${user.name}</td>
        </tr>
        `
        const rows = users.map(rowTemplate)
        const tableTemplate = html`
            <style>
                tbody tr:hover {
                    cursor: pointer
                }
            </style>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <table class="w3-table-all">
                <thead>
                    <tr>
                        <th>Id</th><th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `
        render(tableTemplate, this.shadowRoot)
    }
}

customElements.define("user-table", UserTableComponent)