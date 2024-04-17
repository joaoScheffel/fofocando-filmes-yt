export function sortItemArray (items: any[]): any {
    return items[Math.floor(Math.random() * Object.keys(items).length)]
}