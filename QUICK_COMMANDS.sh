#!/bin/bash
# الأوامر السريعة لإدارة المشروع | Quick Project Management Commands

# ألوان للمخرجات
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# مجلد المشروع
PROJECT_DIR="/home/user/webapp"

echo -e "${BLUE}=== أوامر إدارة مشروع دراسة الجدوى العقارية ===${NC}"
echo -e "${BLUE}=== Real Estate Feasibility Project Management ===${NC}"
echo

# دالة لطباعة رسالة ملونة
print_message() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

print_error() {
    echo -e "${RED}[خطأ] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[تحذير] $1${NC}"
}

# دالة التحقق من نجاح الأمر
check_success() {
    if [ $? -eq 0 ]; then
        print_message "$1 تم بنجاح"
    else
        print_error "فشل في $1"
        exit 1
    fi
}

# الانتقال لمجلد المشروع
cd $PROJECT_DIR

echo "1. تنظيف المنفذ والعمليات..."
fuser -k 3000/tcp 2>/dev/null || true
pm2 delete webapp 2>/dev/null || true
print_message "تم تنظيف المنفذ 3000"

echo
echo "2. التحقق من التبعيات..."
if [ ! -d "node_modules" ]; then
    print_warning "التبعيات غير موجودة، سيتم تثبيتها..."
    npm install
    check_success "تثبيت التبعيات"
else
    print_message "التبعيات موجودة"
fi

echo
echo "3. بناء المشروع..."
npm run build
check_success "بناء المشروع"

echo
echo "4. تشغيل الخدمة باستخدام PM2..."
pm2 start ecosystem.config.cjs
check_success "تشغيل الخدمة"

echo
echo "5. اختبار الخدمة..."
sleep 3
if curl -s -f http://localhost:3000 > /dev/null; then
    print_message "الخدمة تعمل بنجاح على المنفذ 3000"
    echo -e "${GREEN}🌐 الرابط المحلي: http://localhost:3000${NC}"
    echo -e "${GREEN}🔗 الرابط العام: https://3000-i9bjcztmedautkyfpv351-6532622b.e2b.dev${NC}"
else
    print_error "الخدمة لا تعمل، فحص السجلات..."
    pm2 logs webapp --nostream
fi

echo
echo "6. عرض حالة العمليات..."
pm2 list

echo
echo -e "${BLUE}=== معلومات مفيدة ===${NC}"
echo -e "${YELLOW}• للتحقق من السجلات: pm2 logs webapp --nostream${NC}"
echo -e "${YELLOW}• لإعادة تشغيل الخدمة: pm2 restart webapp${NC}"
echo -e "${YELLOW}• لإيقاف الخدمة: pm2 stop webapp${NC}"
echo -e "${YELLOW}• لحذف الخدمة: pm2 delete webapp${NC}"
echo

echo -e "${GREEN}✅ تم إعداد المشروع بنجاح!${NC}"