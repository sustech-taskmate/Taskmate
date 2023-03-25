#[derive(Debug)]
struct Account {
    id: i32,
    sid: i32,
    name: String,
    token: String,
}

use rusqlite::{params, Connection, Result};
pub fn create_database() -> Result<()> {
    create_table_account_info()?;
    Ok(())
}

fn create_table_account_info() -> Result<()> {
    let conn = Connection::open("LocalData.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS account_info(
            id   INTEGER PRIMARY KEY,
            sid   INTEGER,
            name TEXT NOT NULL,
            token TEXT NOT NULL
        );",
        (), // empty list of parameters.
    )?;
    Ok(())
}

fn create_table_course_account_relation() -> Result<()> {
    let conn = Connection::open("LocalData.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS course_account_relation (
            account_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            relation TEXT NOT NULL,
            PRIMARY KEY (account_id, course_id),
            FOREIGN KEY (account_id) REFERENCES account (id),
            FOREIGN KEY (course_id) REFERENCES course_info (id)
        );",
        (), // empty list of parameters.
    )?;
    Ok(())
}

fn create_table_assignment_info() -> Result<()> {
    let conn = Connection::open("LocalData.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS assignment_info (
            id INTEGER PRIMARY KEY,
            course_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            start_date DATE,
            end_date DATE,
            description TEXT,
            is_allowed_delay_submit BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY (course_id) REFERENCES course_info (id)
        );",
        (), // empty list of parameters.
    )?;
    Ok(())
}

fn create_table_assignment_allocation() -> Result<()> {
    let conn = Connection::open("LocalData.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS assignment_allocation (
            assignment_id INTEGER,
            sid INTEGER NOT NULL,
            problem_id INTEGER NOT NULL,
            description TEXT,
            PRIMARY KEY (assignment_id, sid, problem_id),
            FOREIGN KEY (assignment_id) REFERENCES assignment_info (id)
        );",
        (), // empty list of parameters.
    )?;
    Ok(())
}
fn create_table_url_info() -> Result<()> {
    let conn = Connection::open("LocalData.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS assignment_allocation (
            assignment_id INTEGER,
            sid INTEGER NOT NULL,
            problem_id INTEGER NOT NULL,
            url TEXT,
            score INTEGER,
            comment TEXT,
            PRIMARY KEY (assignment_id, sid, problem_id),
            FOREIGN KEY (assignment_id) REFERENCES assignment_info (id)
        );",
        (), // empty list of parameters.
    )?;
    Ok(())
}