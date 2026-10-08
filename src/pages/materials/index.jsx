import React from 'react';
import Layout from '@theme/Layout';
import MaterialsBrowser from '@site/src/components/MaterialsBrowser';
import materials from '@materials-index';

export default function MaterialsPage() {
  return (
    <Layout title="资料分享" description="浏览同学分享的课程笔记、复习资料与代码" noFooter>
      <MaterialsBrowser materials={materials} />
    </Layout>
  );
}
