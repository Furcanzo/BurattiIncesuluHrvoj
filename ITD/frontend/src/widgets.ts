import html from "hyperlit";
import {text as hyperappText} from "hyperapp";
import {currentYear, debounce, randInt} from "./util";
import {toCanvas} from "qrcode";
import {confirm} from "bootbox";
import {ShopLocation} from "./models";
import "../lib/instascan.min.js";

const addStyle = (content: any, addition: { [key: string]: string }) => {

    return {...content, props: {...content.props, style: {...(content.props.style || {}), ...addition}}};
}
const addClass = (content: any, addition: string[]) => {
    return {...content, props: {...content.props, "class": (content.props["class"] || "") + " " + addition.join(" ")}};
}
export const clickable = (content: any) => {
    return addStyle(content, {cursor: "pointer"});
}
export const background = (content: any, backgroundColor: Color) => {
    return addClass(content, [`bg-${backgroundColor}`])
}
export type Color =
    "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "white"
    | "transparent"
    | "dark"
    | "light";
export type FormType = "text" | "email" | "password" | "number" | "tel";
export type TextSize = "1" | "2" | "3" | "4" | "5" | "6";
export type ButtonSize = "sm" | "md" | "lg";
export const formField = <State>(value: string, title: string, onUpdate: (state: State, inputEvent: Event) => any, type_?: FormType) => {

    return html`
    <div class="form-group">
        <label>${title}</label>
        <input type=${type_} oninput="${onUpdate}" value="${value}" class="form-control">
    </div>
    `;
}

export const card = (title: any, content: any, border?: Color, onClick?: any, row: boolean = false) => {
    return html`
    <div class="card bg-light text-center ${border ? "border-" + border : ""}" onclick="${onClick}">
        <div class="card-body">
            ${addClass(title, ["card-title"])}
            <div class="card-text  ${row && 'row'}"> ${content}</div>
        </div>
    </div>
    `;
}

export interface NavigationItem {
    active: boolean;
    title: string;
    onClick?: any;
}

const navigationCardItem = (item: NavigationItem) => {
    return html`<li class="nav-item">
        <a class="nav-link ${item.active ? 'active' : ""}" onclick="${item.onClick}">${item.title}</a>    
        </li>`
}
export const navigationCard = (navs: NavigationItem[], body: any[]) => {
    return html`
    <div class="card">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
            ${navs.map(navigationCardItem)}
            </ul>
        </div>
        <div class="card-body">
            ${body}
        </div>
    </div>
    `;
}
export const row = (inner: any[]) => {
    return html`<div class="row mt-2">${inner}</div>`;
}

export const column = (inner: any[]) => {
    return html`<div class="col-12 col-md-6 col-lg-3">${inner}</div>`
}

export const largeColumn = (inner: any[]) => {
    return html`<div class="col-12">${inner}</div>`
}

export const smallColumn = (inner: any[]) => {
    return html`<div class="col-6 col-xs-6 col-md-6 col-lg-3">${inner}</div>`
}

export const form = (children: any[]) => {
    return html`
    <form>
        ${children}
    </form>
    `;
}

export const button = <State>(text: string, color: Color, onClick: (state: State) => any, size: ButtonSize = "md", huge: boolean = false, disabled: boolean = false) => {
    return html`
    <button class="btn btn-${color} btn-${size} ${huge && 'btn-block'}" ${disabled && "disabled"} onclick="${onClick}">${text}</button>
    `
}

export const qrCodeGenerator = (text: string, width?: number) => {
    const randomId = `qr-${randInt()}`;
    debounce(async () => {
        await toCanvas(document.getElementById(randomId), text, {errorCorrectionLevel: "H", width});
    });
    return html`<canvas id="${randomId}"></canvas>`;
}

export const qrCodeReader = <State>(onRead: (state: State, text: string) => any) => {
    const randomReader = `qrRead-${randInt()}`;
    const randomInput = `${randomReader}-input`;
    debounce(async () => {
        debugger;
        const scanner = new (window as any).Instascan.Scanner({video: document.getElementById(randomReader)});
        scanner.addListener('scan', (content) => {
            console.log(content);
            (document.getElementById(randomInput) as HTMLInputElement).value = content;
        });
        const cameras = await (window as any).Instascan.Camera.getCameras();
        scanner.start(cameras[0]);

    });
    return html`<div class="mx-auto"><video id="${randomReader}" class="mx-auto"></video><input type="hidden" oninput="${onRead}" id="${randomInput}"></div>`;
}

export const confirmationPrompt = <State>(question: string, onConfirm: (state: State) => any, buttons: { confirm: BootboxButton, cancel: BootboxButton }, onCancel?: (state: State) => any) => {
    const randomModal = `modal-${randInt()}`;
    const randomCancel = `${randomModal}-cancel`;
    confirm({
        message: question,
        size: "large",
        callback: (result) => {
            if (result) {
                document.getElementById(randomModal).click();
            } else if (!!onCancel) {
                document.getElementById(randomCancel).click();
            }
        },
        buttons,
    });
    return html`<button id="${randomModal}" onclick="${onConfirm}" hidden></button>
            <button id="${randomCancel}" onclick="${onCancel}" hidden></button>`;
};

export const markerMap = (location: ShopLocation) => {
    const randomMap = `map-${randInt()}`;
    const googleMapsLocation = new google.maps.LatLng(location.lat, location.lon);
    debounce(() => {
        const map = new google.maps.Map(document.getElementById(randomMap), {zoom: 4, center: googleMapsLocation});
        const marker = new google.maps.Marker({
            position: googleMapsLocation,
            map,
        });
        // https://developers.google.com/maps/documentation/javascript/directions
        // TODO: Use Google APIs to display transport.
    });
    return html`<div id="${randomMap}"></div>`;
}

const navbarItem = (navigationItem: NavigationItem) => {
    return clickable(html`
      <li class="nav-item ${navigationItem.active ? "active" : ""}">
        <a class="nav-link" onclick="${navigationItem.onClick}">${navigationItem.title}${navigationItem.active ? (html`<span class="sr-only">(current)</span>`) : ""}</a>
      </li>`);
}
export const navbar = (navigationItems: NavigationItem[], onHomeClick: any) => {
    return html`<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" onclick="${onHomeClick}">CLup</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
    ${navigationItems.map(navbarItem)}
    </ul>
      
  </div>
</nav>`;
};

const footer = background(html`
<footer class="w-100 text-center">
<p>Copyright © ${currentYear}, Roberto Buratti, Hrvoje Hrvoj, Ozan Incesulu – All rights reserved</p>
</footer>
`, "light");

export const wrapper = (navbar: any, body: any[]) => {
    return html`
<div>
    ${navbar}
    <main role="main">
        <div class="container pb-5">
        ${body.map(row)}
        </div>
    </main>
    ${footer}
    </div>
    `;
}

export const titleText = (content: string, size: TextSize = "3") => {
    const tag = "h" + size;
    return html`<${tag} class="text-center ml-auto mr-auto mt-2">${content}</${tag}>`;
}

export const text = (...elements: string | any) => {
    const compiled = elements.map(element => {
        if(typeof element === "string") {
            return hyperappText(element);
        }
        return element;
    })
    return html`<p>${compiled}</p>`;
}

export const url = (link: string, innerContent: any, newTab: boolean = true) => {
    const target = newTab ? {target:'_blank'} : {};
    return html`<a href="${link}" ${target}>${innerContent}</a>`
}
export const centered = (content: any) => {
    return addClass(content, ["mx-auto"]);
}

export const fillWidth = (content: any) => {
    return addClass(content, ["w-100"]);
}

export const inlineForm = (content: any) => {
    return addClass(content, ["form-inline"]);
}