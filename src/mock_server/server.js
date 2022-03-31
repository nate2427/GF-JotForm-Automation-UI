import { createServer, Response } from "miragejs"
import submission_titles_for_date_range from "./submission_titles_for_date_range";
import organized_form_submissions from "./organized_form_submissions";

export function makeServer({ environment = "test" } = {}) {
    let server = createServer({
        environment,
        routes() {
            this.namespace = "api/v1";
            this.post("/get-date-range", () => {
                return submission_titles_for_date_range
            })
            this.post("/get-forms-and-submissions", () => {
                return organized_form_submissions
            })
            this.post('get-download-links', () => {
                return [
                    'gf_google_leads.xlsx',
                    'thrive_google_leads.xlsx'
                ]
            })
            this.get('gf_google_leads.xlsx', () => {
                return new Response(200, {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": "attachment; filename=gf_google_leads.xlsx"
                }, 'gf_google_leads.xlsx')
            })
            this.get('thrive_google_leads.xlsx', () => {
                return new Response(200, {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": "attachment; filename=gf_google_leads.xlsx"
                }, 'thrive_google_leads.xlsx')
            })
        },
    })

    return server
}