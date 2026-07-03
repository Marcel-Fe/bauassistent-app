"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[477],{2616:(e,t,n)=>{let r,i;n.d(t,{l:()=>z});var o=n(5407),a=n(2115),s=n(7274),l=n(7362);let c=new s.Box3,u=new s.Vector3;class d extends s.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new s.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new s.InterleavedBufferAttribute(n,3,0)),this.setAttribute("instanceEnd",new s.InterleavedBufferAttribute(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new s.InstancedInterleavedBuffer(n,2*t,1);return this.setAttribute("instanceColorStart",new s.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new s.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,o=e.count;i<o;i++)u.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(u)),u.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}let f=parseInt(s.REVISION.replace(/\D+/g,""));class m extends s.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:s.UniformsUtils.clone(s.UniformsUtils.merge([s.UniformsLib.common,s.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${f>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let p=f>=125?"uv1":"uv2",h=new s.Vector4,v=new s.Vector3,g=new s.Vector3,b=new s.Vector4,y=new s.Vector4,w=new s.Vector4,x=new s.Vector3,E=new s.Matrix4,S=new s.Line3,P=new s.Vector3,O=new s.Box3,M=new s.Sphere,A=new s.Vector4;function _(e,t,n){return A.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),A.multiplyScalar(1/A.w),A.x=i/n.width,A.y=i/n.height,A.applyMatrix4(e.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}class L extends s.Mesh{constructor(e=new d,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)v.fromBufferAttribute(t,e),g.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+v.distanceTo(g);let i=new s.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(i,1,1)),this}raycast(e,t){let n,o;let a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let u=this.matrixWorld,d=this.geometry,f=this.material;if(i=f.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),M.copy(d.boundingSphere).applyMatrix4(u),a)n=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(r.origin));n=_(l,e,f.resolution)}if(M.radius+=n,!1!==r.intersectsSphere(M)){if(null===d.boundingBox&&d.computeBoundingBox(),O.copy(d.boundingBox).applyMatrix4(u),a)o=.5*i;else{let e=Math.max(l.near,O.distanceToPoint(r.origin));o=_(l,e,f.resolution)}O.expandByScalar(o),!1!==r.intersectsBox(O)&&(a?function(e,t){let n=e.matrixWorld,o=e.geometry,a=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,a.count);for(let o=0;o<c;o++){S.start.fromBufferAttribute(a,o),S.end.fromBufferAttribute(l,o),S.applyMatrix4(n);let c=new s.Vector3,u=new s.Vector3;r.distanceSqToSegment(S.start,S.end,u,c),u.distanceTo(c)<.5*i&&t.push({point:u,pointOnLine:c,distance:r.origin.distanceTo(u),object:e,face:null,faceIndex:o,uv:null,[p]:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),m=-t.near;r.at(1,w),w.w=1,w.applyMatrix4(t.matrixWorldInverse),w.applyMatrix4(o),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,x.copy(w),E.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<f;t++){if(b.fromBufferAttribute(u,t),y.fromBufferAttribute(d,t),b.w=1,y.w=1,b.applyMatrix4(E),y.applyMatrix4(E),b.z>m&&y.z>m)continue;if(b.z>m){let e=b.z-y.z,t=(b.z-m)/e;b.lerp(y,t)}else if(y.z>m){let e=y.z-b.z,t=(y.z-m)/e;y.lerp(b,t)}b.applyMatrix4(o),y.applyMatrix4(o),b.multiplyScalar(1/b.w),y.multiplyScalar(1/y.w),b.x*=a.x/2,b.y*=a.y/2,y.x*=a.x/2,y.y*=a.y/2,S.start.copy(b),S.start.z=0,S.end.copy(y),S.end.z=0;let c=S.closestPointToPointParameter(x,!0);S.at(c,P);let f=s.MathUtils.lerp(b.z,y.z,c),h=f>=-1&&f<=1,v=x.distanceTo(P)<.5*i;if(h&&v){S.start.fromBufferAttribute(u,t),S.end.fromBufferAttribute(d,t),S.start.applyMatrix4(l),S.end.applyMatrix4(l);let i=new s.Vector3,o=new s.Vector3;r.distanceSqToSegment(S.start,S.end,o,i),n.push({point:o,pointOnLine:i,distance:r.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,[p]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(h),this.material.uniforms.resolution.value.set(h.z,h.w))}}class C extends d{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(3===t)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class T extends L{constructor(e=new C,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let j=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:r,lineWidth:i,segments:c,dashed:u,...f},p){var h,v;let g=(0,l.C)(e=>e.size),b=a.useMemo(()=>c?new L:new T,[c]),[y]=a.useState(()=>new m),w=(null==n||null==(h=n[0])?void 0:h.length)===4?4:3,x=a.useMemo(()=>{let r=c?new d:new C,i=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),w)}return r},[e,c,n,w]);return a.useLayoutEffect(()=>{b.computeLineDistances()},[e,b]),a.useLayoutEffect(()=>{u?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[u,y]),a.useEffect(()=>()=>{x.dispose(),y.dispose()},[x]),a.createElement("primitive",(0,o.A)({object:b,ref:p},f),a.createElement("primitive",{object:x,attach:"geometry"}),a.createElement("primitive",(0,o.A)({object:y,attach:"material",color:t,vertexColors:!!n,resolution:[g.width,g.height],linewidth:null!==(v=null!=r?r:i)&&void 0!==v?v:1,dashed:u,transparent:4===w},f)))}),z=a.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let i=a.useRef(null);a.useImperativeHandle(r,()=>i.current,[]);let l=a.useMemo(()=>[0,0,0,1,0,0],[]),c=a.useRef(null),u=a.useRef(null);return a.useLayoutEffect(()=>{let n=i.current.parent,r=null!=t?t:null==n?void 0:n.geometry;if(!r||c.current===r&&u.current===e)return;c.current=r,u.current=e;let o=new s.EdgesGeometry(r,e).attributes.position.array;i.current.geometry.setPositions(o),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),a.createElement(j,(0,o.A)({segments:!0,points:l,ref:i,raycast:()=>null},n))})},3197:(e,t,n)=>{n.d(t,{x:()=>c});var r=n(5407),i=n(2115),o=n(7274),a=n(7362);let s=parseInt(o.REVISION.replace(/\D+/g,"")),l=function(e,t,n,r){var i;return(i=class extends o.ShaderMaterial{constructor(r){for(let i in super({vertexShader:t,fragmentShader:n,...r}),e)this.uniforms[i]=new o.Uniform(e[i]),Object.defineProperty(this,i,{get(){return this.uniforms[i].value},set(e){this.uniforms[i].value=e}});this.uniforms=o.UniformsUtils.clone(this.uniforms)}}).key=o.MathUtils.generateUUID(),i}({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new o.Color,sectionColor:new o.Color,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new o.Vector3,worldPlanePosition:new o.Vector3},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${s>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),c=i.forwardRef(({args:e,cellColor:t="#000000",sectionColor:n="#2080ff",cellSize:s=.5,sectionSize:c=1,followCamera:u=!1,infiniteGrid:d=!1,fadeDistance:f=100,fadeStrength:m=1,fadeFrom:p=1,cellThickness:h=.5,sectionThickness:v=1,side:g=o.BackSide,...b},y)=>{(0,a.e)({GridMaterial:l});let w=i.useRef(null);i.useImperativeHandle(y,()=>w.current,[]);let x=new o.Plane,E=new o.Vector3(0,1,0),S=new o.Vector3(0,0,0);return(0,a.D)(e=>{x.setFromNormalAndCoplanarPoint(E,S).applyMatrix4(w.current.matrixWorld);let t=w.current.material,n=t.uniforms.worldCamProjPosition,r=t.uniforms.worldPlanePosition;x.projectPoint(e.camera.position,n.value),r.value.set(0,0,0).applyMatrix4(w.current.matrixWorld)}),i.createElement("mesh",(0,r.A)({ref:w,frustumCulled:!1},b),i.createElement("gridMaterial",(0,r.A)({transparent:!0,"extensions-derivatives":!0,side:g},{cellSize:s,sectionSize:c,cellColor:t,sectionColor:n,cellThickness:h,sectionThickness:v},{fadeDistance:f,fadeStrength:m,fadeFrom:p,infiniteGrid:d,followCamera:u})),i.createElement("planeGeometry",{args:e}))})},3093:(e,t,n)=>{n.d(t,{N:()=>y});var r=n(5407),i=n(7362),o=n(2115),a=n(7274),s=Object.defineProperty,l=(e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t,n)=>(l(e,"symbol"!=typeof t?t+"":t,n),n);class u{constructor(){c(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}}var d=Object.defineProperty,f=(e,t,n)=>t in e?d(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,m=(e,t,n)=>(f(e,"symbol"!=typeof t?t+"":t,n),n);let p=new a.Ray,h=new a.Plane,v=Math.cos(Math.PI/180*70),g=(e,t)=>(e%t+t)%t;class b extends u{constructor(e,t){super(),m(this,"object"),m(this,"domElement"),m(this,"enabled",!0),m(this,"target",new a.Vector3),m(this,"minDistance",0),m(this,"maxDistance",1/0),m(this,"minZoom",0),m(this,"maxZoom",1/0),m(this,"minPolarAngle",0),m(this,"maxPolarAngle",Math.PI),m(this,"minAzimuthAngle",-1/0),m(this,"maxAzimuthAngle",1/0),m(this,"enableDamping",!1),m(this,"dampingFactor",.05),m(this,"enableZoom",!0),m(this,"zoomSpeed",1),m(this,"enableRotate",!0),m(this,"rotateSpeed",1),m(this,"enablePan",!0),m(this,"panSpeed",1),m(this,"screenSpacePanning",!0),m(this,"keyPanSpeed",7),m(this,"zoomToCursor",!1),m(this,"autoRotate",!1),m(this,"autoRotateSpeed",2),m(this,"reverseOrbit",!1),m(this,"reverseHorizontalOrbit",!1),m(this,"reverseVerticalOrbit",!1),m(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),m(this,"mouseButtons",{LEFT:a.MOUSE.ROTATE,MIDDLE:a.MOUSE.DOLLY,RIGHT:a.MOUSE.PAN}),m(this,"touches",{ONE:a.TOUCH.ROTATE,TWO:a.TOUCH.DOLLY_PAN}),m(this,"target0"),m(this,"position0"),m(this,"zoom0"),m(this,"_domElementKeyEvents",null),m(this,"getPolarAngle"),m(this,"getAzimuthalAngle"),m(this,"setPolarAngle"),m(this,"setAzimuthalAngle"),m(this,"getDistance"),m(this,"getZoomScale"),m(this,"listenToKeyEvents"),m(this,"stopListenToKeyEvents"),m(this,"saveState"),m(this,"reset"),m(this,"update"),m(this,"connect"),m(this,"dispose"),m(this,"dollyIn"),m(this,"dollyOut"),m(this,"getScale"),m(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>u.phi,this.getAzimuthalAngle=()=>u.theta,this.setPolarAngle=e=>{let t=g(e,2*Math.PI),r=u.phi;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),d.phi=t-r,n.update()},this.setAzimuthalAngle=e=>{let t=g(e,2*Math.PI),r=u.theta;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),d.theta=t-r,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),l=s.NONE},this.update=(()=>{let t=new a.Vector3,i=new a.Vector3(0,1,0),o=new a.Quaternion().setFromUnitVectors(e.up,i),m=o.clone().invert(),g=new a.Vector3,y=new a.Quaternion,w=2*Math.PI;return function(){let x=n.object.position;o.setFromUnitVectors(e.up,i),m.copy(o).invert(),t.copy(x).sub(n.target),t.applyQuaternion(o),u.setFromVector3(t),n.autoRotate&&l===s.NONE&&I(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(u.theta+=d.theta*n.dampingFactor,u.phi+=d.phi*n.dampingFactor):(u.theta+=d.theta,u.phi+=d.phi);let E=n.minAzimuthAngle,S=n.maxAzimuthAngle;isFinite(E)&&isFinite(S)&&(E<-Math.PI?E+=w:E>Math.PI&&(E-=w),S<-Math.PI?S+=w:S>Math.PI&&(S-=w),E<=S?u.theta=Math.max(E,Math.min(S,u.theta)):u.theta=u.theta>(E+S)/2?Math.max(E,u.theta):Math.min(S,u.theta)),u.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,u.phi)),u.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(b,n.dampingFactor):n.target.add(b),n.zoomToCursor&&C||n.object.isOrthographicCamera?u.radius=H(u.radius):u.radius=H(u.radius*f),t.setFromSpherical(u),t.applyQuaternion(m),x.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),!0===n.enableDamping?(d.theta*=1-n.dampingFactor,d.phi*=1-n.dampingFactor,b.multiplyScalar(1-n.dampingFactor)):(d.set(0,0,0),b.set(0,0,0));let P=!1;if(n.zoomToCursor&&C){let r=null;if(n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera){let e=t.length();r=H(e*f);let i=e-r;n.object.position.addScaledVector(_,i),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new a.Vector3(L.x,L.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix(),P=!0;let i=new a.Vector3(L.x,L.y,0);i.unproject(n.object),n.object.position.sub(i).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;null!==r&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(p.origin.copy(n.object.position),p.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(p.direction))<v?e.lookAt(n.target):(h.setFromNormalAndCoplanarPoint(n.object.up,n.target),p.intersectPlane(h,n.target))))}else n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera&&(P=1!==f)&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/f)),n.object.updateProjectionMatrix());return f=1,C=!1,!!(P||g.distanceToSquared(n.object.position)>c||8*(1-y.dot(n.object.quaternion))>c)&&(n.dispatchEvent(r),g.copy(n.object.position),y.copy(n.object.quaternion),P=!1,!0)}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",q),n.domElement.addEventListener("pointercancel",Q),n.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,r,i,o,a;n.domElement&&(n.domElement.style.touchAction="auto"),null==(e=n.domElement)||e.removeEventListener("contextmenu",et),null==(t=n.domElement)||t.removeEventListener("pointerdown",q),null==(r=n.domElement)||r.removeEventListener("pointercancel",Q),null==(i=n.domElement)||i.removeEventListener("wheel",J),null==(o=n.domElement)||o.ownerDocument.removeEventListener("pointermove",K),null==(a=n.domElement)||a.ownerDocument.removeEventListener("pointerup",Q),null!==n._domElementKeyEvents&&n._domElementKeyEvents.removeEventListener("keydown",ee)};let n=this,r={type:"change"},i={type:"start"},o={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},l=s.NONE,c=1e-6,u=new a.Spherical,d=new a.Spherical,f=1,b=new a.Vector3,y=new a.Vector2,w=new a.Vector2,x=new a.Vector2,E=new a.Vector2,S=new a.Vector2,P=new a.Vector2,O=new a.Vector2,M=new a.Vector2,A=new a.Vector2,_=new a.Vector3,L=new a.Vector2,C=!1,T=[],j={};function z(){return Math.pow(.95,n.zoomSpeed)}function I(e){n.reverseOrbit||n.reverseHorizontalOrbit?d.theta+=e:d.theta-=e}function U(e){n.reverseOrbit||n.reverseVerticalOrbit?d.phi+=e:d.phi-=e}let R=(()=>{let e=new a.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),b.add(e)}})(),D=(()=>{let e=new a.Vector3;return function(t,r){!0===n.screenSpacePanning?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),b.add(e)}})(),k=(()=>{let e=new a.Vector3;return function(t,r){let i=n.domElement;if(i&&n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera){let o=n.object.position;e.copy(o).sub(n.target);let a=e.length();R(2*t*(a*=Math.tan(n.object.fov/2*Math.PI/180))/i.clientHeight,n.object.matrix),D(2*r*a/i.clientHeight,n.object.matrix)}else i&&n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera?(R(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),D(r*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function N(e){n.object instanceof a.PerspectiveCamera&&n.object.isPerspectiveCamera||n.object instanceof a.OrthographicCamera&&n.object.isOrthographicCamera?f=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function V(e){if(!n.zoomToCursor||!n.domElement)return;C=!0;let t=n.domElement.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top,o=t.width,a=t.height;L.x=r/o*2-1,L.y=-(i/a*2)+1,_.set(L.x,L.y,1).unproject(n.object).sub(n.object.position).normalize()}function H(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function B(e){y.set(e.clientX,e.clientY)}function F(e){E.set(e.clientX,e.clientY)}function W(){if(1==T.length)y.set(T[0].pageX,T[0].pageY);else{let e=.5*(T[0].pageX+T[1].pageX),t=.5*(T[0].pageY+T[1].pageY);y.set(e,t)}}function Y(){if(1==T.length)E.set(T[0].pageX,T[0].pageY);else{let e=.5*(T[0].pageX+T[1].pageX),t=.5*(T[0].pageY+T[1].pageY);E.set(e,t)}}function G(){let e=T[0].pageX-T[1].pageX,t=T[0].pageY-T[1].pageY,n=Math.sqrt(e*e+t*t);O.set(0,n)}function X(e){if(1==T.length)w.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);w.set(n,r)}x.subVectors(w,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*x.x/t.clientHeight),U(2*Math.PI*x.y/t.clientHeight)),y.copy(w)}function Z(e){if(1==T.length)S.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);S.set(n,r)}P.subVectors(S,E).multiplyScalar(n.panSpeed),k(P.x,P.y),E.copy(S)}function $(e){var t;let r=er(e),i=e.pageX-r.x,o=e.pageY-r.y,a=Math.sqrt(i*i+o*o);M.set(0,a),A.set(0,Math.pow(M.y/O.y,n.zoomSpeed)),t=A.y,N(f/t),O.copy(M)}function q(e){var t,r;!1!==n.enabled&&(0===T.length&&(null==(t=n.domElement)||t.ownerDocument.addEventListener("pointermove",K),null==(r=n.domElement)||r.ownerDocument.addEventListener("pointerup",Q)),T.push(e),"touch"===e.pointerType?function(e){switch(en(e),T.length){case 1:switch(n.touches.ONE){case a.TOUCH.ROTATE:if(!1===n.enableRotate)return;W(),l=s.TOUCH_ROTATE;break;case a.TOUCH.PAN:if(!1===n.enablePan)return;Y(),l=s.TOUCH_PAN;break;default:l=s.NONE}break;case 2:switch(n.touches.TWO){case a.TOUCH.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&G(),n.enablePan&&Y(),l=s.TOUCH_DOLLY_PAN;break;case a.TOUCH.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&G(),n.enableRotate&&W(),l=s.TOUCH_DOLLY_ROTATE;break;default:l=s.NONE}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case a.MOUSE.DOLLY:if(!1===n.enableZoom)return;V(e),O.set(e.clientX,e.clientY),l=s.DOLLY;break;case a.MOUSE.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;F(e),l=s.PAN}else{if(!1===n.enableRotate)return;B(e),l=s.ROTATE}break;case a.MOUSE.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;B(e),l=s.ROTATE}else{if(!1===n.enablePan)return;F(e),l=s.PAN}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e))}function K(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(en(e),l){case s.TOUCH_ROTATE:if(!1===n.enableRotate)return;X(e),n.update();break;case s.TOUCH_PAN:if(!1===n.enablePan)return;Z(e),n.update();break;case s.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&$(e),n.enablePan&&Z(e),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&$(e),n.enableRotate&&X(e),n.update();break;default:l=s.NONE}}(e):function(e){if(!1!==n.enabled)switch(l){case s.ROTATE:if(!1===n.enableRotate)return;!function(e){w.set(e.clientX,e.clientY),x.subVectors(w,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*x.x/t.clientHeight),U(2*Math.PI*x.y/t.clientHeight)),y.copy(w),n.update()}(e);break;case s.DOLLY:var t,r;if(!1===n.enableZoom)return;(M.set(e.clientX,e.clientY),A.subVectors(M,O),A.y>0)?(t=z(),N(f/t)):A.y<0&&(r=z(),N(f*r)),O.copy(M),n.update();break;case s.PAN:if(!1===n.enablePan)return;S.set(e.clientX,e.clientY),P.subVectors(S,E).multiplyScalar(n.panSpeed),k(P.x,P.y),E.copy(S),n.update()}}(e))}function Q(e){var t,r,i;(function(e){delete j[e.pointerId];for(let t=0;t<T.length;t++)if(T[t].pointerId==e.pointerId){T.splice(t,1);return}})(e),0===T.length&&(null==(t=n.domElement)||t.releasePointerCapture(e.pointerId),null==(r=n.domElement)||r.ownerDocument.removeEventListener("pointermove",K),null==(i=n.domElement)||i.ownerDocument.removeEventListener("pointerup",Q)),n.dispatchEvent(o),l=s.NONE}function J(e){if(!1!==n.enabled&&!1!==n.enableZoom&&(l===s.NONE||l===s.ROTATE)){var t,r;e.preventDefault(),n.dispatchEvent(i),(V(e),e.deltaY<0)?(t=z(),N(f*t)):e.deltaY>0&&(r=z(),N(f/r)),n.update(),n.dispatchEvent(o)}}function ee(e){!1!==n.enabled&&!1!==n.enablePan&&function(e){let t=!1;switch(e.code){case n.keys.UP:k(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:k(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:k(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:k(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}(e)}function et(e){!1!==n.enabled&&e.preventDefault()}function en(e){let t=j[e.pointerId];void 0===t&&(t=new a.Vector2,j[e.pointerId]=t),t.set(e.pageX,e.pageY)}function er(e){return j[(e.pointerId===T[0].pointerId?T[1]:T[0]).pointerId]}this.dollyIn=(e=z())=>{N(f*e),n.update()},this.dollyOut=(e=z())=>{N(f/e),n.update()},this.getScale=()=>f,this.setScale=e=>{N(e),n.update()},this.getZoomScale=()=>z(),void 0!==t&&this.connect(t),this.update()}}let y=o.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:a,enableDamping:s=!0,keyEvents:l=!1,onChange:c,onStart:u,onEnd:d,...f},m)=>{let p=(0,i.C)(e=>e.invalidate),h=(0,i.C)(e=>e.camera),v=(0,i.C)(e=>e.gl),g=(0,i.C)(e=>e.events),y=(0,i.C)(e=>e.setEvents),w=(0,i.C)(e=>e.set),x=(0,i.C)(e=>e.get),E=(0,i.C)(e=>e.performance),S=t||h,P=a||g.connected||v.domElement,O=o.useMemo(()=>new b(S),[S]);return(0,i.D)(()=>{O.enabled&&O.update()},-1),o.useEffect(()=>(l&&O.connect(!0===l?P:l),O.connect(P),()=>void O.dispose()),[l,P,n,O,p]),o.useEffect(()=>{let e=e=>{p(),n&&E.regress(),c&&c(e)},t=e=>{u&&u(e)},r=e=>{d&&d(e)};return O.addEventListener("change",e),O.addEventListener("start",t),O.addEventListener("end",r),()=>{O.removeEventListener("start",t),O.removeEventListener("end",r),O.removeEventListener("change",e)}},[c,u,d,O,p,y]),o.useEffect(()=>{if(e){let e=x().controls;return w({controls:O}),()=>w({controls:e})}},[e,O]),o.createElement("primitive",(0,r.A)({ref:m,object:O,enableDamping:s},f))})},9884:(e,t,n)=>{let r,i;n.d(t,{E:()=>y});var o=n(5407),a=n(2115),s=n(2669),l=n(7274),c=n(7362);let u=new l.Vector3,d=new l.Vector3,f=new l.Vector3,m=new l.Vector2;function p(e,t,n){let r=u.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,o=n.height/2;return[r.x*i+i,-(r.y*o)+o]}let h=e=>1e-10>Math.abs(e)?0:e;function v(e,t,n=""){let r="matrix3d(";for(let n=0;16!==n;n++)r+=h(t[n]*e.elements[n])+(15!==n?",":")");return n+r}let g=(r=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,r)),b=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,i(t),"translate(-50%,-50%)")),y=a.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:v,fullscreen:y,portal:w,distanceFactor:x,sprite:E=!1,transform:S=!1,occlude:P,onOcclude:O,castShadow:M,receiveShadow:A,material:_,geometry:L,zIndexRange:C=[0x1000037,0],calculatePosition:T=p,as:j="div",wrapperClass:z,pointerEvents:I="auto",...U},R)=>{let{gl:D,camera:k,scene:N,size:V,raycaster:H,events:B,viewport:F}=(0,c.C)(),[W]=a.useState(()=>document.createElement(j)),Y=a.useRef(null),G=a.useRef(null),X=a.useRef(0),Z=a.useRef([0,0]),$=a.useRef(null),q=a.useRef(null),K=(null==w?void 0:w.current)||B.connected||D.domElement.parentNode,Q=a.useRef(null),J=a.useRef(!1),ee=a.useMemo(()=>P&&"blending"!==P||Array.isArray(P)&&P.length&&function(e){return e&&"object"==typeof e&&"current"in e}(P[0]),[P]);a.useLayoutEffect(()=>{let e=D.domElement;P&&"blending"===P?(e.style.zIndex=`${Math.floor(C[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[P]),a.useLayoutEffect(()=>{if(G.current){let e=Y.current=s.createRoot(W);if(N.updateMatrixWorld(),S)W.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=T(G.current,k,V);W.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return K&&(i?K.prepend(W):K.appendChild(W)),()=>{K&&K.removeChild(W),e.unmount()}}},[K,S]),a.useLayoutEffect(()=>{z&&(W.className=z)},[z]);let et=a.useMemo(()=>S?{position:"absolute",top:0,left:0,width:V.width,height:V.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...y&&{top:-V.height/2,left:-V.width/2,width:V.width,height:V.height},...n},[n,v,y,V,S]),en=a.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);a.useLayoutEffect(()=>{var t,i;J.current=!1,S?null==(t=Y.current)||t.render(a.createElement("div",{ref:$,style:et},a.createElement("div",{ref:q,style:en},a.createElement("div",{ref:R,className:r,style:n,children:e})))):null==(i=Y.current)||i.render(a.createElement("div",{ref:R,style:et,className:r,children:e}))});let er=a.useRef(!0);(0,c.D)(e=>{if(G.current){k.updateMatrixWorld(),G.current.updateWorldMatrix(!0,!1);let e=S?Z.current:T(G.current,k,V);if(S||Math.abs(X.current-k.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){let t=function(e,t){let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),o=t.getWorldDirection(f);return i.angleTo(o)>Math.PI/2}(G.current,k),n=!1;ee&&(Array.isArray(P)?n=P.map(e=>e.current):"blending"!==P&&(n=[N]));let r=er.current;if(n){let e=function(e,t,n,r){let i=u.setFromMatrixPosition(e.matrixWorld),o=i.clone();o.project(t),m.set(o.x,o.y),n.setFromCamera(m,t);let a=n.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}(G.current,k,H,n);er.current=e&&!t}else er.current=!t;r!==er.current&&(O?O(!er.current):W.style.display=er.current?"block":"none");let i=Math.floor(C[0]/2),o=P?ee?[C[0],i]:[i-1,0]:C;if(W.style.zIndex=`${function(e,t,n){if(t instanceof l.PerspectiveCamera||t instanceof l.OrthographicCamera){let r=u.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),o=r.distanceTo(i),a=(n[1]-n[0])/(t.far-t.near),s=n[1]-a*t.far;return Math.round(a*o+s)}}(G.current,k,o)}`,S){let[e,t]=[V.width/2,V.height/2],n=k.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:o,bottom:a,right:s}=k,l=g(k.matrixWorldInverse),c=r?`scale(${n})translate(${h(-(s+o)/2)}px,${h((i+a)/2)}px)`:`translateZ(${n}px)`,u=G.current.matrixWorld;E&&((u=k.matrixWorldInverse.clone().transpose().copyPosition(u).scale(G.current.scale)).elements[3]=u.elements[7]=u.elements[11]=0,u.elements[15]=1),W.style.width=V.width+"px",W.style.height=V.height+"px",W.style.perspective=r?"":`${n}px`,$.current&&q.current&&($.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,q.current.style.transform=b(u,1/((x||10)/400)))}else{let t=void 0===x?1:function(e,t){if(t instanceof l.OrthographicCamera)return t.zoom;if(!(t instanceof l.PerspectiveCamera))return 1;{let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*n.distanceTo(r))}}(G.current,k)*x;W.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,X.current=k.zoom}}if(!ee&&Q.current&&!J.current){if(S){if($.current){let e=$.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=k;if(t||L)U.scale&&(Array.isArray(U.scale)?U.scale instanceof l.Vector3?Q.current.scale.copy(U.scale.clone().divideScalar(1)):Q.current.scale.set(1/U.scale[0],1/U.scale[1],1/U.scale[2]):Q.current.scale.setScalar(1/U.scale));else{let t=(x||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;Q.current.scale.set(n,r,1)}J.current=!0}}}else{let t=W.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,n=t.clientWidth*e,r=t.clientHeight*e;Q.current.scale.set(n,r,1),J.current=!0}Q.current.lookAt(e.camera.position)}}});let ei=a.useMemo(()=>({vertexShader:S?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[S]);return a.createElement("group",(0,o.A)({},U,{ref:G}),P&&!ee&&a.createElement("mesh",{castShadow:M,receiveShadow:A,ref:Q},L||a.createElement("planeGeometry",null),_||a.createElement("shaderMaterial",{side:l.DoubleSide,vertexShader:ei.vertexShader,fragmentShader:ei.fragmentShader})))})},4521:(e,t,n)=>{n.d(t,{Hl:()=>f});var r=n(7362),i=n(2115),o=n(7274);function a(e,t){let n;return(...r)=>{window.clearTimeout(n),n=window.setTimeout(()=>e(...r),t)}}let s=["x","y","top","bottom","left","right","width","height"],l=(e,t)=>s.every(n=>e[n]===t[n]);var c=n(2353),u=n(5155);function d({ref:e,children:t,fallback:n,resize:s,style:c,gl:d,events:f=r.f,eventSource:m,eventPrefix:p,shadows:h,linear:v,flat:g,legacy:b,orthographic:y,frameloop:w,dpr:x,performance:E,raycaster:S,camera:P,scene:O,onPointerMissed:M,onCreated:A,..._}){i.useMemo(()=>(0,r.e)(o),[]);let L=(0,r.u)(),[C,T]=function({debounce:e,scroll:t,polyfill:n,offsetSize:r}={debounce:0,scroll:!1,offsetSize:!1}){var o;let s=n||("undefined"==typeof window?class{}:window.ResizeObserver);if(!s)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[c,u]=(0,i.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),d=(0,i.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:c,orientationHandler:null}),f=e?"number"==typeof e?e:e.scroll:null,m=e?"number"==typeof e?e:e.resize:null,p=(0,i.useRef)(!1);(0,i.useEffect)(()=>(p.current=!0,()=>void(p.current=!1)));let[h,v,g]=(0,i.useMemo)(()=>{let e=()=>{if(!d.current.element)return;let{left:e,top:t,width:n,height:i,bottom:o,right:a,x:s,y:c}=d.current.element.getBoundingClientRect(),f={left:e,top:t,width:n,height:i,bottom:o,right:a,x:s,y:c};d.current.element instanceof HTMLElement&&r&&(f.height=d.current.element.offsetHeight,f.width=d.current.element.offsetWidth),Object.freeze(f),p.current&&!l(d.current.lastBounds,f)&&u(d.current.lastBounds=f)};return[e,m?a(e,m):e,f?a(e,f):e]},[u,r,f,m]);function b(){d.current.scrollContainers&&(d.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",g,!0)),d.current.scrollContainers=null),d.current.resizeObserver&&(d.current.resizeObserver.disconnect(),d.current.resizeObserver=null),d.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",d.current.orientationHandler))}function y(){d.current.element&&(d.current.resizeObserver=new s(g),d.current.resizeObserver.observe(d.current.element),t&&d.current.scrollContainers&&d.current.scrollContainers.forEach(e=>e.addEventListener("scroll",g,{capture:!0,passive:!0})),d.current.orientationHandler=()=>{g()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",d.current.orientationHandler))}return o=!!t,(0,i.useEffect)(()=>{if(o)return window.addEventListener("scroll",g,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",g,!0)},[g,o]),(0,i.useEffect)(()=>(window.addEventListener("resize",v),()=>void window.removeEventListener("resize",v)),[v]),(0,i.useEffect)(()=>{b(),y()},[t,g,v]),(0,i.useEffect)(()=>b,[]),[e=>{e&&e!==d.current.element&&(b(),d.current.element=e,d.current.scrollContainers=function e(t){let n=[];if(!t||t===document.body)return n;let{overflow:r,overflowX:i,overflowY:o}=window.getComputedStyle(t);return[r,i,o].some(e=>"auto"===e||"scroll"===e)&&n.push(t),[...n,...e(t.parentElement)]}(e),y())},c,h]}({scroll:!0,debounce:{scroll:50,resize:0},...s}),j=i.useRef(null),z=i.useRef(null);i.useImperativeHandle(e,()=>j.current);let I=(0,r.a)(M),[U,R]=i.useState(!1),[D,k]=i.useState(!1);if(U)throw U;if(D)throw D;let N=i.useRef(null);(0,r.b)(()=>{let e=j.current;T.width>0&&T.height>0&&e&&(N.current||(N.current=(0,r.c)(e)),async function(){await N.current.configure({gl:d,scene:O,events:f,shadows:h,linear:v,flat:g,legacy:b,orthographic:y,frameloop:w,dpr:x,performance:E,raycaster:S,camera:P,size:T,onPointerMissed:(...e)=>null==I.current?void 0:I.current(...e),onCreated:e=>{null==e.events.connect||e.events.connect(m?(0,r.i)(m)?m.current:m:z.current),p&&e.setEvents({compute:(e,t)=>{let n=e[p+"X"],r=e[p+"Y"];t.pointer.set(n/t.size.width*2-1,-(2*(r/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==A||A(e)}}),N.current.render((0,u.jsx)(L,{children:(0,u.jsx)(r.E,{set:k,children:(0,u.jsx)(i.Suspense,{fallback:(0,u.jsx)(r.B,{set:R}),children:null!=t?t:null})})}))}())}),i.useEffect(()=>{let e=j.current;if(e)return()=>(0,r.d)(e)},[]);let V=m?"none":"auto";return(0,u.jsx)("div",{ref:z,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:V,...c},..._,children:(0,u.jsx)("div",{ref:C,style:{width:"100%",height:"100%"},children:(0,u.jsx)("canvas",{ref:j,style:{display:"block"},children:n})})})}function f(e){return(0,u.jsx)(c.Af,{children:(0,u.jsx)(d,{...e})})}n(1065)},7418:(e,t)=>{function n(e,t){var n=e.length;for(e.push(t);0<n;){var r=n-1>>>1,i=e[r];if(0<o(i,t))e[r]=t,e[n]=i,n=r;else break}}function r(e){return 0===e.length?null:e[0]}function i(e){if(0===e.length)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;for(var r=0,i=e.length,a=i>>>1;r<a;){var s=2*(r+1)-1,l=e[s],c=s+1,u=e[c];if(0>o(l,n))c<i&&0>o(u,l)?(e[r]=u,e[c]=n,r=c):(e[r]=l,e[s]=n,r=s);else if(c<i&&0>o(u,n))e[r]=u,e[c]=n,r=c;else break}}return t}function o(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}if(t.unstable_now=void 0,"object"==typeof performance&&"function"==typeof performance.now){var a,s=performance;t.unstable_now=function(){return s.now()}}else{var l=Date,c=l.now();t.unstable_now=function(){return l.now()-c}}var u=[],d=[],f=1,m=null,p=3,h=!1,v=!1,g=!1,b=!1,y="function"==typeof setTimeout?setTimeout:null,w="function"==typeof clearTimeout?clearTimeout:null,x="undefined"!=typeof setImmediate?setImmediate:null;function E(e){for(var t=r(d);null!==t;){if(null===t.callback)i(d);else if(t.startTime<=e)i(d),t.sortIndex=t.expirationTime,n(u,t);else break;t=r(d)}}function S(e){if(g=!1,E(e),!v){if(null!==r(u))v=!0,P||(P=!0,a());else{var t=r(d);null!==t&&j(S,t.startTime-e)}}}var P=!1,O=-1,M=5,A=-1;function _(){return!!b||!(t.unstable_now()-A<M)}function L(){if(b=!1,P){var e=t.unstable_now();A=e;var n=!0;try{e:{v=!1,g&&(g=!1,w(O),O=-1),h=!0;var o=p;try{t:{for(E(e),m=r(u);null!==m&&!(m.expirationTime>e&&_());){var s=m.callback;if("function"==typeof s){m.callback=null,p=m.priorityLevel;var l=s(m.expirationTime<=e);if(e=t.unstable_now(),"function"==typeof l){m.callback=l,E(e),n=!0;break t}m===r(u)&&i(u),E(e)}else i(u);m=r(u)}if(null!==m)n=!0;else{var c=r(d);null!==c&&j(S,c.startTime-e),n=!1}}break e}finally{m=null,p=o,h=!1}n=void 0}}finally{n?a():P=!1}}}if("function"==typeof x)a=function(){x(L)};else if("undefined"!=typeof MessageChannel){var C=new MessageChannel,T=C.port2;C.port1.onmessage=L,a=function(){T.postMessage(null)}}else a=function(){y(L,0)};function j(e,n){O=y(function(){e(t.unstable_now())},n)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<e?Math.floor(1e3/e):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_next=function(e){switch(p){case 1:case 2:case 3:var t=3;break;default:t=p}var n=p;p=t;try{return e()}finally{p=n}},t.unstable_requestPaint=function(){b=!0},t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=p;p=e;try{return t()}finally{p=n}},t.unstable_scheduleCallback=function(e,i,o){var s=t.unstable_now();switch(o="object"==typeof o&&null!==o&&"number"==typeof(o=o.delay)&&0<o?s+o:s,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=0x3fffffff;break;case 4:l=1e4;break;default:l=5e3}return l=o+l,e={id:f++,callback:i,priorityLevel:e,startTime:o,expirationTime:l,sortIndex:-1},o>s?(e.sortIndex=o,n(d,e),null===r(u)&&e===r(d)&&(g?(w(O),O=-1):g=!0,j(S,o-s))):(e.sortIndex=l,n(u,e),v||h||(v=!0,P||(P=!0,a()))),e},t.unstable_shouldYield=_,t.unstable_wrapCallback=function(e){var t=p;return function(){var n=p;p=t;try{return e.apply(this,arguments)}finally{p=n}}}},1065:(e,t,n)=>{e.exports=n(7418)},2947:(e,t,n)=>{n.d(t,{DY:()=>s,IU:()=>c,uv:()=>l});let r=e=>"object"==typeof e&&"function"==typeof e.then,i=[];function o(e,t,n=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let i=0;i<r;i++)if(!n(e[i],t[i]))return!1;return!0}function a(e,t=null,n=!1,s={}){for(let r of(null===t&&(t=[e]),i))if(o(t,r.keys,r.equal)){if(n)return;if(Object.prototype.hasOwnProperty.call(r,"error"))throw r.error;if(Object.prototype.hasOwnProperty.call(r,"response"))return s.lifespan&&s.lifespan>0&&(r.timeout&&clearTimeout(r.timeout),r.timeout=setTimeout(r.remove,s.lifespan)),r.response;if(!n)throw r.promise}let l={keys:t,equal:s.equal,remove:()=>{let e=i.indexOf(l);-1!==e&&i.splice(e,1)},promise:(r(e)?e:e(...t)).then(e=>{l.response=e,s.lifespan&&s.lifespan>0&&(l.timeout=setTimeout(l.remove,s.lifespan))}).catch(e=>l.error=e)};if(i.push(l),!n)throw l.promise}let s=(e,t,n)=>a(e,t,!1,n),l=(e,t,n)=>void a(e,t,!0,n),c=e=>{if(void 0===e||0===e.length)i.splice(0,i.length);else{let t=i.find(t=>o(e,t.keys,t.equal));t&&t.remove()}}},3027:(e,t,n)=>{var r=n(2115),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,a=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var u="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,u=r[1];return s(function(){i.value=n,i.getSnapshot=t,c(i)&&u({inst:i})},[e,n,t]),a(function(){return c(i)&&u({inst:i}),e(function(){c(i)&&u({inst:i})})},[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:u},4564:(e,t,n)=>{var r=n(2115),i=n(4236),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=i.useSyncExternalStore,s=r.useRef,l=r.useEffect,c=r.useMemo,u=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var d=s(null);if(null===d.current){var f={hasValue:!1,value:null};d.current=f}else f=d.current;var m=a(e,(d=c(function(){function e(e){if(!l){if(l=!0,a=e,e=r(e),void 0!==i&&f.hasValue){var t=f.value;if(i(t,e))return s=t}return s=e}if(t=s,o(a,e))return t;var n=r(e);return void 0!==i&&i(t,n)?(a=e,t):(a=e,s=n)}var a,s,l=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,n,r,i]))[0],d[1]);return l(function(){f.hasValue=!0,f.value=m},[m]),u(m),m}},4236:(e,t,n)=>{e.exports=n(3027)},8010:(e,t,n)=>{e.exports=n(4564)},5407:(e,t,n)=>{n.d(t,{A:()=>r});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}},2353:(e,t,n)=>{n.d(t,{Af:()=>s,Nz:()=>i,u5:()=>l,y3:()=>d});var r=n(2115);function i(e,t,n){if(!e)return;if(!0===n(e))return e;let r=t?e.return:e.child;for(;r;){let e=i(r,t,n);if(e)return e;r=t?null:r.sibling}}function o(e){try{return Object.defineProperties(e,{_currentRenderer:{get:()=>null,set(){}},_currentRenderer2:{get:()=>null,set(){}}})}catch(t){return e}}(()=>{var e,t;return"undefined"!=typeof window&&((null==(e=window.document)?void 0:e.createElement)||(null==(t=window.navigator)?void 0:t.product)==="ReactNative")})()?r.useLayoutEffect:r.useEffect;let a=o(r.createContext(null));class s extends r.Component{render(){return r.createElement(a.Provider,{value:this._reactInternals},this.props.children)}}function l(){let e=r.useContext(a);if(null===e)throw Error("its-fine: useFiber must be called within a <FiberProvider />!");let t=r.useId();return r.useMemo(()=>{for(let n of[e,null==e?void 0:e.alternate]){if(!n)continue;let e=i(n,!1,e=>{let n=e.memoizedState;for(;n;){if(n.memoizedState===t)return!0;n=n.next}});if(e)return e}},[e,t])}let c=Symbol.for("react.context"),u=e=>null!==e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===c;function d(){let e=function(){let e=l(),[t]=r.useState(()=>new Map);t.clear();let n=e;for(;n;){let e=n.type;u(e)&&e!==a&&!t.has(e)&&t.set(e,r.use(o(e))),n=n.return}return t}();return r.useMemo(()=>Array.from(e.keys()).reduce((t,n)=>i=>r.createElement(t,null,r.createElement(n.Provider,{...i,value:e.get(n)})),e=>r.createElement(s,{...e})),[e])}},2985:(e,t,n)=>{n.d(t,{h:()=>u});var r=n(2115),i=n(8010);let o=e=>{let t;let n=new Set,r=(e,r)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=r?r:"object"!=typeof i||null===i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,o={setState:r,getState:i,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(r,i,o);return o},a=e=>e?o(e):o,{useSyncExternalStoreWithSelector:s}=i,l=e=>e,c=(e,t)=>{let n=a(e),i=(e,i=t)=>(function(e,t=l,n){let i=s(e.subscribe,e.getState,e.getInitialState,t,n);return r.useDebugValue(i),i})(n,e,i);return Object.assign(i,n),i},u=(e,t)=>e?c(e,t):c}}]);