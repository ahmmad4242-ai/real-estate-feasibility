import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
import datetime
import tempfile
import os
from fpdf import FPDF

# -----------------------------
# إعداد الصفحة
# -----------------------------
st.set_page_config(page_title="🏗️ Real Estate Feasibility Pro", layout="wide")
lang = st.sidebar.radio("🌐 Language / اللغة", ["English", "العربية"])
rtl = (lang == "العربية")

def tr(en, ar):
    return ar if rtl else en

st.title(tr("🏗️ Real Estate Feasibility — Pro Edition",
             "🏗️ نظام دراسة الجدوى العقارية المتكامل — النسخة الاحترافية"))

# -----------------------------
# حفظ/تحميل المشروع
# -----------------------------
def save_project(data, filename="project.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return filename

def load_project(uploaded_file):
    return json.load(uploaded_file) if uploaded_file else None

# -----------------------------
# إدخال بيانات المشروع
# -----------------------------
st.sidebar.subheader(tr("📌 Project Settings", "📌 إعداد المشروع"))
project_name = st.sidebar.text_input(tr("Project Name", "اسم المشروع"), "Mixed-Use Tower")
client_name = st.sidebar.text_input(tr("Client Name", "اسم العميل"), "")
city = st.sidebar.text_input(tr("City", "المدينة"), "Riyadh")
land_area = st.sidebar.number_input(tr("Land Area (sqm)", "مساحة الأرض (م²)"), min_value=0, value=10000)
far = st.sidebar.number_input("FAR", min_value=0.0, value=4.0)

# Logo
logo_file = st.sidebar.file_uploader(tr("Upload Logo", "ارفع الشعار"), type=["png", "jpg", "jpeg"])
logo_path = None
if logo_file:
    tmp_logo = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(logo_file.name)[1])
    tmp_logo.write(logo_file.read())
    tmp_logo.close()
    logo_path = tmp_logo.name
    st.sidebar.image(logo_path, width=120)

# -----------------------------
# الاستخدامات
# -----------------------------
st.sidebar.subheader(tr("🏷️ Uses", "🏷️ الاستخدامات"))
default_uses = {
    "Residential": {"share": 0.40, "eff": 0.75},
    "Office": {"share": 0.30, "eff": 0.80},
    "Retail": {"share": 0.20, "eff": 0.78},
    "Hotel": {"share": 0.10, "eff": 0.65},
}
uses = {}
for u, vals in default_uses.items():
    share = st.sidebar.number_input(f"{u} {tr('Share', 'نسبة')}", 0.0, 1.0, vals["share"], step=0.01)
    eff = st.sidebar.number_input(f"{u} {tr('Efficiency', 'كفاءة')}", 0.0, 1.0, vals["eff"], step=0.01)
    uses[u] = {"share": share, "eff": eff}

# -----------------------------
# حساب GFA / GLA
# -----------------------------
gfa_total = land_area * far
results = []
for u in uses:
    gla = uses[u]["share"] * gfa_total * uses[u]["eff"]
    gfa_u = gla / uses[u]["eff"] if uses[u]["eff"] else 0
    results.append([u, round(gfa_u, 0), round(gla, 0)])
df = pd.DataFrame(results, columns=["Use", "GFA", "GLA"])

# -----------------------------
# الإيرادات
# -----------------------------
st.header(tr("💰 Revenues", "💰 الإيرادات"))
rev_rows = []
for u in uses:
    st.subheader(u)
    col1, col2, col3, col4 = st.columns(4)
    rent = col1.number_input(f"{u} Rent SAR/m²/yr", value=1000 if u != "Hotel" else 20000)
    occ = col2.number_input(f"{u} Occupancy %", value=0.85, step=0.05)
    sale = col3.number_input(f"{u} Sale Price SAR/m²", value=10000)
    opex = col4.number_input(f"{u} OPEX %", value=0.20, step=0.05)
    gla = float(df.loc[df["Use"] == u, "GLA"].values[0])
    rent_income = gla * rent * occ
    opex_cost = rent_income * opex
    noi = rent_income - opex_cost
    sale_rev = gla * sale
    rev_rows.append([u, gla, rent_income, opex_cost, noi, sale_rev])

df_rev = pd.DataFrame(rev_rows, columns=["Use", "GLA", "Rent Income", "OPEX", "NOI", "Sales Revenue"])

# -----------------------------
# التكاليف
# -----------------------------
st.header(tr("💸 Costs", "💸 التكاليف"))
gov_fee_pct = st.number_input(tr("Government Fees %", "رسوم حكومية %"), value=0.03)
consultant_fee_pct = st.number_input(tr("Consultant Fee %", "أتعاب استشاري %"), value=0.04)
supervision_fee_pct = st.number_input(tr("Supervision Fee %", "إشراف %"), value=0.03)
dev_fee_pct = st.number_input(tr("Developer Fee %", "أتعاب مطور %"), value=0.05)
cont_pct = st.number_input(tr("Contingency %", "احتياطي %"), value=0.05)

base_cost = df["GFA"].sum() * 2000  # افتراضي SAR 2000/m²
gov_fee = base_cost * gov_fee_pct
consultant_fee = base_cost * consultant_fee_pct
supervision_fee = base_cost * supervision_fee_pct
subtotal = base_cost + gov_fee + consultant_fee + supervision_fee
dev_fee = subtotal * dev_fee_pct
cont = (subtotal + dev_fee) * cont_pct
total_cost = subtotal + dev_fee + cont

# -----------------------------
# مؤشرات مالية
# -----------------------------
total_noi = df_rev["NOI"].sum()
net_income = total_noi - (total_noi * 0.1) - (total_cost * 0.02)
yield_pct = (total_noi / total_cost * 100) if total_cost else 0.0
net_yield_pct = (net_income / total_cost * 100) if total_cost else 0.0

st.subheader(tr("📈 Financial KPIs", "📈 المؤشرات المالية"))
c1, c2, c3 = st.columns(3)
c1.metric("Yield", f"{yield_pct:.1f} %")
c2.metric("Net Yield", f"{net_yield_pct:.1f} %")
c3.metric("Total Cost", f"{total_cost:,.0f} SAR")

# -----------------------------
# الرسوم البيانية
# -----------------------------
st.header(tr("📊 Charts", "📊 الرسوم البيانية"))
col_a, col_b = st.columns(2)
with col_a:
    st.bar_chart(df.set_index("Use")["GLA"])
with col_b:
    st.bar_chart(df_rev.set_index("Use")["NOI"])

# -----------------------------
# الحفظ/الاستيراد
# -----------------------------
st.sidebar.subheader(tr("💾 Save / Load", "💾 حفظ/تحميل"))
if st.sidebar.button(tr("Save Project", "حفظ المشروع")):
    data = {
        "project_name": project_name,
        "client_name": client_name,
        "city": city,
        "land_area": land_area,
        "far": far,
        "uses": uses,
    }
    filename = save_project(data)
    st.sidebar.success(f"Saved: {filename}")
    st.sidebar.download_button("⬇️ Download JSON",
                               data=json.dumps(data, ensure_ascii=False, indent=2),
                               file_name="project.json")

uploaded_file = st.sidebar.file_uploader(tr("Upload Project", "تحميل مشروع"), type=["json"])
if uploaded_file:
    loaded = load_project(uploaded_file)
    st.write("📂", tr("Loaded Project Data", "بيانات المشروع المحملة"), loaded)
