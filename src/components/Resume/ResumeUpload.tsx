import React, { useState } from 'react';
import { Upload, Button, Alert, Form, Input, Typography, Card, Space } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { parsePDF, parseDOCX, validateResumeFile } from '../../utils/resumeParser';
import { validateResumeData } from '../../utils/validators';
import { generateId } from '../../utils/storage';
import { Candidate } from '../../types';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

interface ResumeUploadProps {
  onCandidateCreated: (candidate: Candidate) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onCandidateCreated }) => {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        setIsUploading(false);
        return false;
      }

      setUploadedFile(file);

      // Parse file based on type
      let parsed;
      if (file.type === 'application/pdf') {
        parsed = await parsePDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        parsed = await parseDOCX(file);
      } else {
        setError('Unsupported file type');
        setIsUploading(false);
        return false;
      }

      setParsedData(parsed);

      // If parsing was successful and all fields are present, auto-fill form
      if (parsed.isValid) {
        form.setFieldsValue({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
        });
        setError(null); // Clear any previous errors
      } else {
        // Show what was extracted vs what's missing
        const extractedFields = [];
        if (parsed.name) extractedFields.push('Name');
        if (parsed.email) extractedFields.push('Email');
        if (parsed.phone) extractedFields.push('Phone');
        
        if (extractedFields.length > 0) {
          setError(`✅ Resume uploaded! Extracted: ${extractedFields.join(', ')}. Please fill in the missing fields below.`);
        } else if (parsed.text.includes('file uploaded - please fill the form manually')) {
          setError('✅ File uploaded successfully! Please fill in your details below to continue.');
        } else {
          const missingFieldsText = parsed.missingFields.map(field => {
            switch(field) {
              case 'name': return 'Name';
              case 'email': return 'Email';
              case 'phone': return 'Phone Number';
              default: return field;
            }
          }).join(', ');
          setError(`⚠️ Missing required fields: ${missingFieldsText}. Please fill them below.`);
        }
        
        // Auto-fill any extracted data
        form.setFieldsValue({
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        });
      }

    } catch (err) {
      setError('Error parsing resume. Please try again or fill the form manually.');
      console.error('Resume parsing error:', err);
    } finally {
      setIsUploading(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleFormSubmit = async (values: any) => {
    try {
      // Validate form data
      const validation = validateResumeData(values);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Create candidate object
      const candidate: Candidate = {
        id: generateId(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        resumeUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
        resumeText: parsedData?.text || '',
        interviewStatus: 'not_started',
        currentQuestionIndex: 0,
        answers: [],
        createdAt: new Date().toISOString(),
      };

      onCandidateCreated(candidate);
    } catch (err) {
      setError('Error creating candidate profile. Please try again.');
      console.error('Candidate creation error:', err);
    }
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    showUploadList: false,
    accept: '.pdf,.docx',
  };

  return (
    <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <Title level={4}>Upload Your Resume</Title>
        <Paragraph type="secondary">
          Upload a PDF or DOCX file to automatically extract your information
        </Paragraph>
      </div>

      {error && (
        <Alert
          message={error}
          type={error.includes('✅') ? 'success' : error.includes('⚠️') ? 'warning' : 'error'}
          style={{ marginBottom: '16px' }}
          showIcon
        />
      )}

      <Dragger {...uploadProps} style={{ marginBottom: '24px' }}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF and DOCX files. Maximum file size: 5MB
        </p>
      </Dragger>

      {isUploading && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Text type="secondary">Parsing resume...</Text>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: '100%' }}
            loading={isUploading}
          >
            Start Interview
          </Button>
        </Form.Item>
      </Form>

      {parsedData && (
        <Card size="small" style={{ marginTop: '16px', backgroundColor: parsedData.isValid ? '#f6ffed' : '#fff7e6' }}>
          <Title level={5}>Extracted Information:</Title>
          <Space direction="vertical" size="small">
            {parsedData.name && <Text strong>✓ Name: {parsedData.name}</Text>}
            {parsedData.email && <Text strong>✓ Email: {parsedData.email}</Text>}
            {parsedData.phone && <Text strong>✓ Phone: {parsedData.phone}</Text>}
            {!parsedData.name && !parsedData.email && !parsedData.phone && (
              <Text type="secondary">
                File uploaded successfully! Please fill in your details below to continue with the interview.
              </Text>
            )}
            {parsedData.isValid && (
              <Text type="success" strong>All information extracted successfully!</Text>
            )}
          </Space>
        </Card>
      )}
    </Card>
  );
};
