## **Azure Portal Deployment (Secure Networking)**

### **Step 1 – Create Resource Group**

Portal → Search **Resource groups** → Create → `poc-3tier-rg`

---

### **Step 2 – Create Azure SQL Database (Private)**

1. Search **SQL databases → Create**
2. Name: `pocdb`
3. Server → Create new: `poc-sql-server` (Basic tier)
4. **Networking tab**:
    - Public network access = **Disabled**
    - Create **Private Endpoint** in your VNet (choose new VNet: `poc-vnet`)
5. Create DB.

---

### **Step 3 – Add Products Table**

- Go to SQL Database → **Query editor** → Sign in with Azure AD Admin
- Run:

```sql
CREATE TABLE Products (
  ProductID INT PRIMARY KEY IDENTITY(1,1),
  ProductName NVARCHAR(100)
);
INSERT INTO Products (ProductName) VALUES
('Laptop'), ('Mouse'), ('Keyboard'), ('Monitor'), ('Printer');

```

---

### **Step 4 – Create Backend API App Service (Managed Identity)**

1. Search **App Services → Create**
2. Name: `poc-api-app`
3. Publish: **Code**
4. Runtime: Node 20 LTS
5. Networking tab: Enable VNet integration → Choose `poc-vnet` (so it can reach DB private endpoint)
6. Create.

**Post-creation:**

1. Go to `poc-api-app` → **Identity** → Enable **System-assigned Managed Identity**
2. In SQL Database → **Access control (IAM)** → Add role assignment:
    - Role: **SQL DB Contributor** (or DB-specific role via Azure AD)
    - Assign to: `poc-api-app` managed identity
3. In `poc-api-app` → **Configuration** → Add:
    - `DB_SERVER` = `poc-sql-server.privatelink.database.windows.net`
    - `DB_NAME` = `pocdb`
4. Deploy API code via Deployment Center (upload `api/` folder or connect GitHub)

---

### **Step 5 – Create Frontend App Service**

1. Create new App Service: `poc-frontend-app`
2. Deploy React build (upload via Deployment Center)
3. In **Configuration** → Add:
    - `REACT_APP_API_URL` = `https://poc-api-app.azurewebsites.net`
4. Redeploy build.

---

### **Step 6 – Test**

- Visit **frontend app URL** – should load products from the DB via the API
- SQL DB is only accessible inside the VNet, not publicly.