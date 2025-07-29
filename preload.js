const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// مسار حفظ البيانات
const DATA_PATH = path.join(os.homedir(), '.smart-debt-tracker');
const DATA_FILE = path.join(DATA_PATH, 'debts.json');

contextBridge.exposeInMainWorld('electronAPI', {
    // حفظ البيانات محلياً
    saveData: async (data) => {
        try {
            // إنشاء المجلد إذا لم يكن موجوداً
            await fs.mkdir(DATA_PATH, { recursive: true });
            await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
            return { success: true };
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            return { success: false, error: error.message };
        }
    },

    // تحميل البيانات من الملف المحلي
    loadData: async () => {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            return { success: true, data: JSON.parse(data) };
        } catch (error) {
            if (error.code === 'ENOENT') {
                // الملف غير موجود، إرجاع بيانات فارغة
                return { 
                    success: true, 
                    data: { individual: [], wholesale: [], agent: [] } 
                };
            } else {
                console.error('خطأ في تحميل البيانات:', error);
                return { success: false, error: error.message };
            }
        }
    },

    // التحقق من وجود ملف البيانات
    dataExists: async () => {
        try {
            await fs.access(DATA_FILE);
            return true;
        } catch {
            return false;
        }
    },

    // إنشاء نسخة احتياطية
    createBackup: async () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(DATA_PATH, `backup-${timestamp}.json`);
            const data = await fs.readFile(DATA_FILE, 'utf8');
            await fs.writeFile(backupFile, data);
            return { success: true, backupFile };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});
