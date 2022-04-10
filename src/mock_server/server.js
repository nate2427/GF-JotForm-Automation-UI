import { createServer, Response } from "miragejs"
import submission_titles_for_date_range from "./submission_titles_for_date_range";
import organized_form_submissions from "./organized_form_submissions";

export function makeServer({ environment = "test" } = {}) {
    let server = createServer({
        environment,
        routes() {
            this.timing = 2000;
            // this.namespace = "http://127.0.0.1:5000/api/v1";
            this.post("http://127.0.0.1:5000/api/v1/get-date-range", () => {
                return submission_titles_for_date_range
            })
            this.post("http://127.0.0.1:5000/api/v1/get-forms-and-submissions", () => {
                return organized_form_submissions
            })
            this.get('http://127.0.0.1:5000/api/v1/get-download-links', () => {
                return {
                    "files": [
                        'gf_google_leads.xlsx',
                        'thrive_google_leads.xlsx'
                    ]
                }
            })
            this.get('http://127.0.0.1:5000/api/v1/gf_google_leads.xlsx', () => {
                return new Response(200, {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": "attachment; filename=gf_google_leads.xlsx"
                }, 'gf_google_leads.xlsx')
            })
            this.get('http://127.0.0.1:5000/api/v1/thrive_google_leads.xlsx', () => {
                return new Response(200, {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": "attachment; filename=gf_google_leads.xlsx"
                }, 'thrive_google_leads.xlsx')
            })
        },
    })

    return server
}