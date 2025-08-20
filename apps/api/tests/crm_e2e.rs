use std::time::Duration;

use reqwest::{Client, StatusCode};
use serde_json::json;

// How to run:
// 1) Jalankan server secara terpisah: cargo run -p api
// 2) Set environment yang dibutuhkan (DATABASE_URL, REDIS_URL, JWT_SECRET, dsb.)
// 3) Jalankan test spesifik ini dengan menghapus #[ignore] atau dengan: cargo test -p api -- --ignored
// 4) Opsional: set BASE_URL, TEST_USERNAME, TEST_PASSWORD untuk login otomatis. Jika token tak tersedia, test akan dilewati.

const DEFAULT_BASE_URL: &str = "http://127.0.0.1:3000";

async fn base_url() -> String {
    std::env::var("BASE_URL").unwrap_or_else(|_| DEFAULT_BASE_URL.to_string())
}

async fn http_client() -> Client {
    Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
        .unwrap()
}

async fn get_token_via_env_or_login(client: &Client, base: &str) -> Option<String> {
    if let Ok(token) = std::env::var("TEST_BEARER_TOKEN") {
        return Some(token);
    }

    let username = std::env::var("TEST_USERNAME").ok()?;
    let password = std::env::var("TEST_PASSWORD").ok()?;

    let req_body = json!({ "email": username, "password": password });
    let resp = client
        .post(format!("{}/api/v1/auth/login", base))
        .json(&req_body)
        .send().await.ok()?;

    if resp.status() != StatusCode::OK { return None; }
    let v: serde_json::Value = resp.json().await.ok()?;
    let token = v.get("data")?.get("access_token")?.as_str()?.to_string();
    Some(token)
}

#[ignore]
#[tokio::test]
async fn test_companies_list_smoke() {
    let client = http_client().await;
    let base = base_url().await;
    let Some(token) = get_token_via_env_or_login(&client, &base).await else {
        eprintln!("Skip: no TEST_BEARER_TOKEN or TEST_USERNAME/TEST_PASSWORD set");
        return;
    };

    // small delay in case server just started
    tokio::time::sleep(Duration::from_millis(100)).await;

    let url = format!("{}/api/v1/crm/companies?page=1&per_page=5", base);
    let resp = client
        .get(url)
        .bearer_auth(&token)
        .send().await.expect("request failed");

    assert_eq!(resp.status(), StatusCode::OK);
    let v: serde_json::Value = resp.json().await.expect("parse json");

    assert_eq!(v.get("success").and_then(|b| b.as_bool()), Some(true));
    assert!(v.get("data").is_some(), "missing data field");
}

#[ignore]
#[tokio::test]
async fn test_companies_crud_flow() {
    let client = http_client().await;
    let base = base_url().await;
    let Some(token) = get_token_via_env_or_login(&client, &base).await else {
        eprintln!("Skip: no TEST_BEARER_TOKEN or TEST_USERNAME/TEST_PASSWORD set");
        return;
    };

    // create
    let body = json!({ "name": "Acme Inc.", "website": "https://acme.example" });
    let resp = client
        .post(format!("{}/api/v1/crm/companies", base))
        .bearer_auth(&token)
        .json(&body)
        .send().await.expect("create failed");
    assert_eq!(resp.status(), StatusCode::OK);
    let v: serde_json::Value = resp.json().await.expect("parse json");
    assert_eq!(v.get("success").and_then(|b| b.as_bool()), Some(true));
    let id = v.get("data").and_then(|d| d.get("id")).and_then(|s| s.as_str()).expect("company id").to_string();

    // get
    let resp = client
        .get(format!("{}/api/v1/crm/companies/{}", base, id))
        .bearer_auth(&token)
        .send().await.expect("get failed");
    assert_eq!(resp.status(), StatusCode::OK);

    // update
    let body = json!({ "name": "Acme Updated" });
    let resp = client
        .put(format!("{}/api/v1/crm/companies/{}", base, id))
        .bearer_auth(&token)
        .json(&body)
        .send().await.expect("update failed");
    assert_eq!(resp.status(), StatusCode::OK);

    // delete
    let resp = client
        .delete(format!("{}/api/v1/crm/companies/{}", base, id))
        .bearer_auth(&token)
        .send().await.expect("delete failed");
    assert_eq!(resp.status(), StatusCode::OK);
}

#[ignore]
#[tokio::test]
async fn test_contacts_crud_flow() {
    let client = http_client().await;
    let base = base_url().await;
    let Some(token) = get_token_via_env_or_login(&client, &base).await else {
        eprintln!("Skip: no TEST_BEARER_TOKEN or TEST_USERNAME/TEST_PASSWORD set");
        return;
    };

    // create
    let body = json!({ "first_name": "John", "last_name": "Doe", "email": "john.doe@example.com" });
    let resp = client
        .post(format!("{}/api/v1/crm/contacts", base))
        .bearer_auth(&token)
        .json(&body)
        .send().await.expect("create failed");
    assert_eq!(resp.status(), StatusCode::OK);
    let v: serde_json::Value = resp.json().await.expect("parse json");
    assert_eq!(v.get("success").and_then(|b| b.as_bool()), Some(true));
    let id = v.get("data").and_then(|d| d.get("id")).and_then(|s| s.as_str()).expect("contact id").to_string();

    // get
    let resp = client
        .get(format!("{}/api/v1/crm/contacts/{}", base, id))
        .bearer_auth(&token)
        .send().await.expect("get failed");
    assert_eq!(resp.status(), StatusCode::OK);

    // update
    let body = json!({ "position": "Manager" });
    let resp = client
        .put(format!("{}/api/v1/crm/contacts/{}", base, id))
        .bearer_auth(&token)
        .json(&body)
        .send().await.expect("update failed");
    assert_eq!(resp.status(), StatusCode::OK);

    // delete
    let resp = client
        .delete(format!("{}/api/v1/crm/contacts/{}", base, id))
        .bearer_auth(&token)
        .send().await.expect("delete failed");
    assert_eq!(resp.status(), StatusCode::OK);
}

