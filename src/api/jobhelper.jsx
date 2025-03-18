export default function asset(path) {
    return import.meta.env.VITE_JOBSHEET_BASE_URL + `${path}`
}