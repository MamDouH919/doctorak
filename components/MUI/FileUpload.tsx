'use client';

import { uploadAccountImage, deleteAccountImage } from '@/lib/api/accounts';
import { CloudUpload, Delete } from '@mui/icons-material';
import {
    Box,
    CircularProgress,
    IconButton,
    Typography,
} from '@mui/material';
import * as React from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { useController, Control, RegisterOptions } from 'react-hook-form';
import { toast } from 'sonner';

interface SingleImageUploaderProps {
    name: string;
    control: Control<any>;
    rules?: RegisterOptions;
    progress?: number;
    accept?: Record<string, string[]>;
    maxSize?: number;
    disabled?: boolean;
    loading?: boolean;
    accountId: string;
    alt: string;
}

export function SingleImageUploader({
    name,
    control,
    rules,
    progress = 0,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 1,
    disabled = false,
    loading = false,
    accountId,
    alt,
}: SingleImageUploaderProps) {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules,
    });

    const [preview, setPreview] = React.useState<string | null>(null);
    const [hovered, setHovered] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    const handleDrop = React.useCallback(
        async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            const image = acceptedFiles[0];
            if (!image) return;

            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach(err => {
                    toast.error(`خطأ: ${file.name} - ${err.message}`);
                });
            });

            try {
                setUploading(true);
                // setLocalProgress(0);

                // Optional: You can simulate progress here or integrate with real upload progress.
                const res = await uploadAccountImage(image, accountId, alt);

                toast.success('تم رفع الصورة بنجاح');
                setPreview(res.data.url);
                onChange(res.data.url);
                // setLocalProgress(100); // mark as complete
            } catch (err) {
                console.error(err);
                toast.error('فشل رفع الصورة');
            } finally {
                setUploading(false);
            }
        },
        [accountId, onChange]
    );

    const handleDelete = async () => {
        if (!preview) return;
        try {
            setUploading(true);
            await deleteAccountImage(accountId, preview);
            toast.success('تم حذف الصورة بنجاح');
            setPreview(null);
            onChange(null);
        } catch (err) {
            console.error(err);
            toast.error('فشل حذف الصورة');
        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (typeof value === 'string') {
            setPreview(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const showDropzone = !preview && !uploading;

    return (
        <Box>
            {showDropzone ? (
                <Dropzone
                    onDrop={handleDrop}
                    accept={accept}
                    maxSize={maxSize}
                    maxFiles={1}
                    multiple={false}
                    disabled={disabled || loading || uploading}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragActive
                                    ? 'primary.main'
                                    : error
                                        ? 'error.main'
                                        : 'grey.400',
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                bgcolor: isDragActive ? 'grey.100' : 'background.paper',
                                cursor: 'pointer',
                                opacity: disabled ? 0.6 : 1,
                                width: 200,
                                height: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUpload sx={{ fontSize: 40, color: 'grey.500' }} />
                            <Typography mt={2} fontSize={14}>
                                اسحب أو انقر لرفع صورة
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontSize={12}>
                                الحد الأقصى للحجم: {formatBytes(maxSize)}
                            </Typography>
                        </Box>
                    )}
                </Dropzone>
            ) : (
                <Box
                    position="relative"
                    width={200}
                    height={200}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                >
                    {preview && (
                        <img
                            src={preview}
                            alt="الصورة المرفوعة"
                            style={{ objectFit: 'contain' }}
                            width={'100%'}
                            height={'100%'}
                        />
                    )}

                    {/* Show loader/progress on top */}
                    {uploading && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgcolor="rgba(0,0,0,0.5)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                        >
                            <CircularProgress
                                color="primary"
                            />
                        </Box>
                    )}

                    {!uploading && hovered && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgcolor="rgba(0,0,0,0.5)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                        >
                            <IconButton
                                onClick={handleDelete}
                                disabled={loading}
                                color="error"
                                size="large"
                            >
                                <Delete fontSize="large" />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            )}

            {error && (
                <Typography color="error" fontSize={12} mt={1}>
                    {error.message}
                </Typography>
            )}
        </Box>
    );
}

// Helper to format file size
function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
