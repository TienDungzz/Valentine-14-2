"""Bake the dedicated Valentine studio IK and export selected characters.
Run after wardrobe/IK setup. Never changes original master .blend files.
"""
import bpy
import os
import json

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 220
    scene.render.fps = 30
    for label in ['Male', 'Female']:
        rig = next(o for o in bpy.data.collections['CHAR_' + label].objects if o.type == 'ARMATURE')
        bpy.ops.object.select_all(action='DESELECT')
        rig.select_set(True)
        bpy.context.view_layer.objects.active = rig
        bpy.ops.object.mode_set(mode='POSE')
        for bone in rig.data.bones:
            bone.select = bone.name in ['upperarm_l', 'lowerarm_l', 'hand_l', 'upperarm_r', 'lowerarm_r', 'hand_r', 'head']
        bpy.ops.nla.bake(frame_start=1, frame_end=220, step=3, only_selected=True,
                        visual_keying=True, clear_constraints=True, use_current_action=True,
                        bake_types={'POSE'})
        bpy.ops.object.mode_set(mode='OBJECT')
        rig.animation_data.action.name = label + '_GiftStory'
    for image in list(bpy.data.images):
        if image.users and image.type == 'IMAGE' and image.has_data and max(image.size) > 1024:
            ratio = 1024 / max(image.size)
            image.scale(max(1, int(image.size[0] * ratio)), max(1, int(image.size[1] * ratio)))
            image.pack()
    output = os.path.join(ROOT, '.qa', 'characters')
    os.makedirs(output, exist_ok=True)
    for label in ['Male', 'Female']:
        col = bpy.data.collections['CHAR_' + label]
        rig = next(o for o in col.objects if o.type == 'ARMATURE')
        rig.location = (0, 0, 0)
        rig.scale = (1, 1, 1)
        bpy.ops.object.select_all(action='DESELECT')
        for obj in col.objects:
            if not obj.hide_render and obj.type in {'MESH', 'ARMATURE', 'EMPTY'}:
                obj.hide_set(False)
                obj.select_set(True)
        bpy.context.view_layer.objects.active = rig
        scene.frame_set(1)
        bpy.ops.export_scene.gltf(
            filepath=os.path.join(output, label.lower() + '-raw.glb'),
            export_format='GLB', use_selection=True, use_active_scene=True, export_animations=True,
            export_animation_mode='ACTIVE_ACTIONS',
            export_frame_range=True, export_force_sampling=True,
            export_image_format='AUTO', export_cameras=False, export_lights=False,
        )
        rig.location.x = -1 if label == 'Male' else 1
    scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art', 'characters', 'valentine', 'gift-story.blend'))
    manifest = {
        'fps': 30, 'frames': [1, 220],
        'characters': [
            {'id': label.lower(), 'url': 'models/characters/' + label.lower() + '-valentine.glb',
             'clip': label + '_GiftStory'} for label in ['Male', 'Female']
        ],
        'milestones': {'held': 1, 'placed': 65, 'joined': 105, 'opened': 170, 'rest': 220},
        'wardrobe': 'oatmeal male cardigan; burgundy female cardigan, ivory top and blue jeans',
        'sourceLicense': 'Sam anatomy/rig CC0 per supplied source README; project wardrobe modifications',
    }
    os.makedirs(os.path.join(ROOT, 'public', 'manifests'), exist_ok=True)
    with open(os.path.join(ROOT, 'public', 'manifests', 'characters.json'), 'w', encoding='utf-8', newline='\n') as file:
        json.dump(manifest, file, ensure_ascii=False, indent=2)
        file.write('\n')
    print('Baked and exported both Valentine characters.')

if __name__ == '__main__':
    run()
