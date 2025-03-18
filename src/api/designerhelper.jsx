export default function asset(path) {
    return import.meta.env.VITE_DESIGNER_JOBSHEET_BASE_URL + `${path}`
}